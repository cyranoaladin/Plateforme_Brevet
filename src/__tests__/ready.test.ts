import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the Prisma singleton so the DB check is fully controllable and this
// suite never touches a real database.
const queryRawMock = vi.fn();
vi.mock('@/lib/prisma', () => ({
  prisma: { $queryRaw: queryRawMock },
}));

describe('API: GET /api/ready', () => {
  const originalEnv = { ...process.env };
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.resetModules();
    queryRawMock.mockReset();
    queryRawMock.mockResolvedValue([{ 1: 1 }]);
    // Direct process.env assignment (not vi.stubEnv), mirroring
    // config.test.ts's convention: matched by the afterEach restore below,
    // so nothing leaks into other test files in the same worker.
    delete process.env.ARIA_MODE;
    delete process.env.QDRANT_URL;
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.unstubAllGlobals();
  });

  it('reports MOCK_OR_BYPASS and never calls Qdrant when ARIA_MODE is mock (default)', async () => {
    process.env.ARIA_MODE = 'mock';

    const { GET } = await import('../app/api/ready/route');
    const res = await GET();
    const body = await res.json();

    expect(body.checks.qdrant).toBe('MOCK_OR_BYPASS');
    expect(fetchMock).not.toHaveBeenCalled();
    expect(res.status).toBe(200);
  });

  it('calls Qdrant /readyz (not /healthz) using the validated env.QDRANT_URL when ARIA_MODE is rag', async () => {
    process.env.ARIA_MODE = 'rag';
    process.env.QDRANT_URL = 'http://qdrant-test:6333';
    fetchMock.mockResolvedValue({ ok: true });

    const { GET } = await import('../app/api/ready/route');
    const res = await GET();
    const body = await res.json();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [calledUrl] = fetchMock.mock.calls[0];
    expect(calledUrl).toBe('http://qdrant-test:6333/readyz');
    expect(body.checks.qdrant).toBe('UP');
    expect(res.status).toBe(200);
  });

  it('does NOT skip the Qdrant check just because QDRANT_URL is unset when ARIA_MODE is rag (regression: env.ts always defaults it)', async () => {
    process.env.ARIA_MODE = 'rag';
    // QDRANT_URL intentionally left unset: src/config/env.ts defaults it to
    // http://localhost:6333, and VectorStoreService relies on that same
    // default - so the readiness route must still gate on ARIA_MODE, not
    // on whether QDRANT_URL was explicitly provided.
    fetchMock.mockResolvedValue({ ok: true });

    const { GET } = await import('../app/api/ready/route');
    await GET();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [calledUrl] = fetchMock.mock.calls[0];
    expect(calledUrl).toBe('http://localhost:6333/readyz');
  });

  it('marks the response NOT_READY (503) when Qdrant /readyz is unreachable in rag mode', async () => {
    process.env.ARIA_MODE = 'rag';
    process.env.QDRANT_URL = 'http://qdrant-test:6333';
    fetchMock.mockRejectedValue(new Error('connect ECONNREFUSED'));

    const { GET } = await import('../app/api/ready/route');
    const res = await GET();
    const body = await res.json();

    expect(body.checks.qdrant).toBe('DOWN');
    expect(res.status).toBe(503);
  });

  it('marks the response NOT_READY (503) when the database check throws', async () => {
    process.env.ARIA_MODE = 'mock';
    queryRawMock.mockRejectedValue(new Error('db down'));

    const { GET } = await import('../app/api/ready/route');
    const res = await GET();
    const body = await res.json();

    expect(body.checks.database).toBe('DOWN');
    expect(res.status).toBe(503);
  });
});
