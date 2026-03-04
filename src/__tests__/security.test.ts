import { describe, it, expect, vi } from 'vitest';
import { checkRateLimit } from '../utils/security/rateLimit';
import { logger } from '../utils/security/logger';

describe('Security: Rate Limiting', () => {
  
  it('should allow requests within limit', () => {
    const key = "user-1-" + Date.now();
    const res1 = checkRateLimit(key, 2, 10000);
    expect(res1.success).toBe(true);
    expect(res1.remaining).toBe(1);

    const res2 = checkRateLimit(key, 2, 10000);
    expect(res2.success).toBe(true);
    expect(res2.remaining).toBe(0);
  });

  it('should block requests exceeding limit', () => {
    const key = "user-2-" + Date.now();
    checkRateLimit(key, 1, 10000);
    const res = checkRateLimit(key, 1, 10000);
    expect(res.success).toBe(false);
    expect(res.remaining).toBe(0);
  });

});

describe('Security: Logger Redaction', () => {
  it('should redact sensitive information in logs', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    
    logger.info("Test login", { email: "pirate@hack.com", apiKey: "123-secret" });
    
    const output = consoleSpy.mock.calls[0][0];
    expect(output).toContain('[REDACTED]');
    expect(output).not.toContain('pirate@hack.com');
    expect(output).not.toContain('123-secret');
    
    consoleSpy.mockRestore();
  });
});

describe('Security: Env SALT Validation', () => {
  it('should have a SALT of at least 16 chars', async () => {
    const { env } = await import('../config/env');
    expect(env.SALT.length).toBeGreaterThanOrEqual(16);
  });
});
