import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Config: Environment Validation', () => {
  
  beforeEach(() => {
    vi.resetModules();
  });

  it('should have default values for critical infrastructure', async () => {
    const { env } = await import('../config/env');
    expect(env.QDRANT_URL).toBeDefined();
    expect(typeof env.QDRANT_TIMEOUT_MS).toBe('number');
  });

  it('should use coercion for numbers', async () => {
    process.env.QDRANT_TIMEOUT_MS = "5000";
    const { env } = await import('../config/env');
    expect(env.QDRANT_TIMEOUT_MS).toBe(5000);
  });

  it('should default rerank provider to none', async () => {
    const { env } = await import('../config/env');
    expect(env.ARIA_RERANK_PROVIDER).toBe('none');
  });

});
