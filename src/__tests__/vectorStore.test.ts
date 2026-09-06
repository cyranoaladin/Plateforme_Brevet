import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// 1. Mock contrôlable du client Qdrant
const searchMock = vi.fn();
const upsertMock = vi.fn().mockResolvedValue({});
const getCollectionsMock = vi.fn().mockResolvedValue({ collections: [{ name: 'aria_docs' }] });
const createCollectionMock = vi.fn().mockResolvedValue(true);
vi.mock('@qdrant/js-client-rest', () => ({
  QdrantClient: vi.fn().mockImplementation(function() {
    return {
      search: searchMock,
      getCollections: getCollectionsMock,
      createCollection: createCollectionMock,
      upsert: upsertMock
    };
  })
}));

import { VectorStoreService as VectorStoreServiceType } from '../services/aria/vectorStore';

import { QdrantClient } from '@qdrant/js-client-rest';

describe('Reliability: VectorStoreService (High Speed)', () => {
  
  let VectorStoreService: typeof VectorStoreServiceType;

  it('should instantiate QdrantClient with checkCompatibility false by default', async () => {
    // Le singleton est déjà initialisé dans beforeEach, on vérifie l'appel au mock
    expect(QdrantClient).toHaveBeenCalledWith(expect.objectContaining({
      checkCompatibility: false
    }));
  });

  beforeEach(async () => {
    // 2. Reset de l'environnement et du module
    vi.resetModules();
    vi.clearAllMocks();
    
    // On force un timeout très court pour la rapidité des tests
    process.env.QDRANT_TIMEOUT_MS = "30";
    vi.stubEnv("NODE_ENV", "test"); // Assurer le mode test pour les fallbacks
    
    // Import dynamique pour recharger le singleton failureCount et lire le nouvel env
    const mod = await import('../services/aria/vectorStore');
    VectorStoreService = mod.VectorStoreService;
  });

  afterEach(() => {
    // vi.stubEnv leaves NODE_ENV stubbed for the rest of the worker process
    // otherwise (vitest.config.ts does not set test.unstubEnvs: true), so
    // every subsequent test file sharing this worker would silently run
    // with NODE_ENV pinned to "test".
    vi.unstubAllEnvs();
    delete process.env.QDRANT_TIMEOUT_MS;
  });

  it('should handle a normal search successfully', async () => {
    searchMock.mockResolvedValue([{ id: '1', score: 0.9, payload: { text: 'Success' } }]);
    
    const result = await VectorStoreService.search("test");
    expect(result.chunks.length).toBe(1);
    expect(result.error).toBeUndefined();
  });

  it('should return TIMEOUT if search exceeds 30ms', async () => {
    // On simule une latence de 100ms (supérieure au timeout de 30ms)
    searchMock.mockImplementation(() => new Promise(r => setTimeout(r, 100)));
    
    const result = await VectorStoreService.search("slow-query");
    expect(result.error).toBe("TIMEOUT");
    expect(result.chunks).toEqual([]);
  });

  it('should open breaker after 3 failures', async () => {
    searchMock.mockRejectedValue(new Error("NETWORK_FAILURE"));

    // 3 échecs consécutifs pour ouvrir le circuit
    await VectorStoreService.search("f1");
    await VectorStoreService.search("f2");
    await VectorStoreService.search("f3");

    // Le 4ème appel doit être bloqué immédiatement par le breaker
    const result = await VectorStoreService.search("blocked-query");
    expect(result.error).toBe("BREAKER_OPEN");
    
    // On vérifie que le moteur n'a pas été sollicité une 4ème fois
    expect(searchMock).toHaveBeenCalledTimes(3);
  });

  describe('upsertChunks: Qdrant point id compatibility', () => {
    const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    it('maps arbitrary caller ids ("1", "docId:page:0", ...) to a valid Qdrant point id (UUID)', async () => {
      // Qdrant rejects plain strings as point ids with a 400 Bad Request -
      // only unsigned 64-bit integers or UUIDs are accepted. Real callers
      // (scripts/ingest-pdfs.ts's chunker, the debug seed route) pass ids
      // like "1" or "docId:page:0" that are neither.
      await VectorStoreService.upsertChunks([
        { id: '1', text: 'chunk one', metadata: {} },
        { id: 'docId123:2:0', text: 'chunk two', metadata: {} },
      ]);

      expect(upsertMock).toHaveBeenCalledTimes(1);
      const [, { points }] = upsertMock.mock.calls[0];
      expect(points).toHaveLength(2);
      for (const point of points) {
        expect(point.id).toMatch(UUID_RE);
      }
    });

    it('is deterministic: the same caller id always maps to the same Qdrant point id (idempotent re-ingestion)', async () => {
      await VectorStoreService.upsertChunks([{ id: 'stable-chunk', text: 'v1', metadata: {} }]);
      const firstId = upsertMock.mock.calls[0][1].points[0].id;

      await VectorStoreService.upsertChunks([{ id: 'stable-chunk', text: 'v2 (re-ingested)', metadata: {} }]);
      const secondId = upsertMock.mock.calls[1][1].points[0].id;

      expect(secondId).toBe(firstId);
    });

    it('preserves the original caller id in payload.chunkId for citation round-tripping', async () => {
      await VectorStoreService.upsertChunks([{ id: 'thales-1', text: 'chunk', metadata: { subject: 'maths' } }]);

      const { points } = upsertMock.mock.calls[0][1];
      expect(points[0].payload.chunkId).toBe('thales-1');
      expect(points[0].payload.subject).toBe('maths');
    });

    it('never lets caller metadata clobber payload.chunkId, even if metadata itself has a "chunkId" key', async () => {
      // Regression: chunkId used to be set BEFORE the ...metadata spread,
      // so any caller-supplied metadata.chunkId silently overwrote the
      // canonical one - breaking citation round-tripping in search().
      await VectorStoreService.upsertChunks([
        { id: 'real-id', text: 'chunk', metadata: { chunkId: 'attacker-or-accidental-value' } },
      ]);

      const { points } = upsertMock.mock.calls[0][1];
      expect(points[0].payload.chunkId).toBe('real-id');
    });
  });

  it('search() returns payload.chunkId as the chunk id when present (not Qdrant\'s internal UUID point id)', async () => {
    // Mirrors what upsertChunks now writes: the real, citable id lives in
    // payload.chunkId, while Qdrant's own "id" is a UUID reserved for
    // storage. ariaPromptBuilder/policy.ts must see "thales-1" here, not a
    // random-looking UUID, for [Source:ID] citations to make sense.
    searchMock.mockResolvedValue([
      { id: 'a1b2c3d4-0000-4000-8000-000000000000', score: 0.9, payload: { text: 'Success', chunkId: 'thales-1' } },
    ]);

    const result = await VectorStoreService.search("test");
    expect(result.chunks[0].id).toBe('thales-1');
  });

});
