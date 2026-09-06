import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock next-auth's getServerSession so we control the "logged in" state
// without needing a real HTTP session/cookie round-trip.
vi.mock('next-auth', () => ({
  default: vi.fn(),
  getServerSession: vi.fn(),
}));

import { getServerSession } from 'next-auth';
import { GET } from '../app/api/user/profile/route';

const mockedGetServerSession = vi.mocked(getServerSession);

describe('Security: Protected route GET /api/user/profile', () => {
  beforeEach(() => {
    mockedGetServerSession.mockReset();
  });

  it('returns 401 when there is no session (unauthenticated)', async () => {
    mockedGetServerSession.mockResolvedValue(null);

    const response = await GET();

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error).toBe('Unauthorized');
  });

  it('returns 200 with the user payload when authenticated', async () => {
    mockedGetServerSession.mockResolvedValue({
      user: { id: 'user-1', email: 'eleve@example.com', name: 'Eleve Test' },
      expires: new Date(Date.now() + 3600_000).toISOString(),
    } as never);

    const response = await GET();

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.authenticated).toBe(true);
    expect(body.user).toEqual({
      id: 'user-1',
      email: 'eleve@example.com',
      name: 'Eleve Test',
    });
  });

  it('returns 401 again once the session is gone (logged out)', async () => {
    mockedGetServerSession.mockResolvedValue(null);

    const response = await GET();

    expect(response.status).toBe(401);
  });
});
