import { describe, it, expect, vi, beforeEach } from 'vitest';

// 1. Mock contrôlable du client Qdrant
const searchMock = vi.fn();
vi.mock('@qdrant/js-client-rest', () => ({
  QdrantClient: vi.fn().mockImplementation(function() {
    return {
      search: searchMock,
      getCollections: vi.fn().mockResolvedValue({ collections: [] }),
      upsert: vi.fn().mockResolvedValue({})
    };
  })
}));

import { VectorStoreService as VectorStoreServiceType } from '../services/aria/vectorStore';

describe('Reliability: VectorStoreService (High Speed)', () => {
  
  let VectorStoreService: typeof VectorStoreServiceType;

  beforeEach(async () => {
    // 2. Reset de l'environnement et du module
    vi.resetModules();
    vi.clearAllMocks();
    
    // On force un timeout très court pour la rapidité des tests
    process.env.QDRANT_TIMEOUT_MS = "30";
    process.env.NODE_ENV = "test"; // Assurer le mode test pour les fallbacks
    
    // Import dynamique pour recharger le singleton failureCount et lire le nouvel env
    const mod = await import('../services/aria/vectorStore');
    VectorStoreService = mod.VectorStoreService;
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

});
