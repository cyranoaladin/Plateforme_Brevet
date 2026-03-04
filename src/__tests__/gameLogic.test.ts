import { describe, it, expect } from 'vitest';
import { calculateRank } from '../types/game';

describe('Logic: Rank Calculation', () => {
  it('should return level 1 for 0 XP', () => {
    const rank = calculateRank(0);
    expect(rank.level).toBe(1);
    expect(rank.name).toBe("Apprenti du Savoir");
  });

  it('should promote to level 2 at 500 XP', () => {
    const rank = calculateRank(500);
    expect(rank.level).toBe(2);
    expect(rank.name).toBe("Explorateur");
  });

  it('should promote to level 3 at 1500 XP', () => {
    const rank = calculateRank(1500);
    expect(rank.level).toBe(3);
    expect(rank.name).toBe("Chevalier du Brevet");
  });

  it('should stay at max rank for very high XP', () => {
    const rank = calculateRank(100000);
    expect(rank.level).toBe(5);
    expect(rank.name).toBe("Expert DNB");
  });
});
