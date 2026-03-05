import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST as seedPOST } from '../app/api/aria/debug/seed/route';
import { POST as searchPOST } from '../app/api/aria/debug/search/route';
import { env } from '../config/env';

describe('Security: Debug Routes', () => {
  const originalEnv = env.NODE_ENV;

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    env.NODE_ENV = originalEnv;
  });

  it('should return 404 for seed route in production', async () => {
    env.NODE_ENV = 'production';
    const response = await seedPOST();
    expect(response.status).toBe(404);
  });

  it('should return 404 for search route in production', async () => {
    env.NODE_ENV = 'production';
    const req = new Request('http://localhost:3000/api/aria/debug/search', {
      method: 'POST',
      body: JSON.stringify({ query: 'test' })
    });
    const response = await searchPOST(req);
    expect(response.status).toBe(404);
  });
});
