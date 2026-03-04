import { describe, it, expect } from 'vitest';
import { getAllNotionsBySubject } from '../content/registry';

describe('Frontend Navigation & Lobby Logic', () => {
  
  it('should list at least one notion for maths lobby', async () => {
    const notions = await getAllNotionsBySubject('maths');
    expect(notions.length).toBeGreaterThan(0);
    expect(notions.some(n => n.id === 'thales')).toBe(true);
  });

  it('should have a consistent route structure for notions', async () => {
    const notions = await getAllNotionsBySubject('maths');
    notions.forEach(n => {
      expect(n.id).toMatch(/^[a-z0-9-]+$/);
    });
  });

});
