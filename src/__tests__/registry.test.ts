import { describe, it, expect } from 'vitest';
import { getNotion, getFrenchExercise, getAllNotionsBySubject, getAllFrenchExercises } from '../content/registry';

describe('Content Registry (Strict Typing)', () => {
  
  it('should resolve a Math notion correctly', async () => {
    const notion = await getNotion('maths', 'thales');
    expect(notion).not.toBeNull();
    expect(notion?.title).toContain('Thalès');
  });

  it('should return null when asking for a notion in French pack (which contains exercises)', async () => {
    // @ts-expect-error: Notion does not exist in French exercise pack
    const notion = await getNotion('francais', 'test-id');
    expect(notion).toBeNull();
  });

  it('should resolve a French exercise correctly', async () => {
    const exercise = await getFrenchExercise('tragique-compr');
    expect(exercise).not.toBeNull();
    expect(exercise?.mode).toBe('comprehension');
  });

  it('should list all Math notions', async () => {
    const notions = await getAllNotionsBySubject('maths');
    expect(notions.length).toBeGreaterThan(0);
    expect(notions[0].id).toBeDefined();
  });

  it('should list all French exercises', async () => {
    const exercises = await getAllFrenchExercises();
    expect(exercises.length).toBeGreaterThan(0);
    expect(exercises[0].mode).toBeDefined();
  });

});
