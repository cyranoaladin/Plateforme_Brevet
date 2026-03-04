import { describe, it, expect } from 'vitest';
import { FrenchContentPackSchema } from '../types/francais';
import { normalizeString, levenshteinDistance, evaluateAnswer } from '../utils/scoring';
import francaisPack from '../content/v1/francais.json';

describe('Module Français - Conformité & Scoring', () => {

  describe('Conformité des Contenus', () => {
    it('should validate the V1 French Content Pack against Zod schema', () => {
      expect(() => FrenchContentPackSchema.parse(francaisPack)).not.toThrow();
    });

    it('should ensure all exercises have a valid license metadata', () => {
      const parsed = FrenchContentPackSchema.parse(francaisPack);
      parsed.exercises.forEach(ex => {
        expect(['original', 'public-domain']).toContain(ex.metadata.license);
      });
    });
  });

  describe('Moteur de Scoring (Normalisation & Levenshtein)', () => {
    it('should normalize strings aggressively for short answers', () => {
      const raw = "C'est un, PANTIN dérisoire !";
      const norm = normalizeString(raw);
      expect(norm).toBe("c est un pantin derisoire");
    });

    it('should evaluate a short_answer correctly despite casing and punctuation', () => {
      const question = { type: 'short_answer', points: 4, correctAnswer: 'pantins dérisoires' };
      const res = evaluateAnswer("Ce sont des pantins dérisoires.", question);
      expect(res.isCorrect).toBe(true);
      expect(res.earnedPoints).toBe(4);
    });

    it('should calculate Levenshtein distance correctly', () => {
      expect(levenshteinDistance("chat", "chats")).toBe(1);
      expect(levenshteinDistance("maison", "maisons")).toBe(1);
      expect(levenshteinDistance("chien", "chien")).toBe(0);
    });

    it('should evaluate dictation segment with partial scoring', () => {
      const question = { type: 'dictation_segment', points: 20, correctAnswer: "Le soleil se couche." };
      
      // Parfait
      expect(evaluateAnswer("Le soleil se couche.", question).earnedPoints).toBe(20);
      
      // 1 faute mineure (levenshtein 1 sur ~20 chars) -> score parfait
      expect(evaluateAnswer("Le soleil se couches.", question).earnedPoints).toBe(20);
      
      // Fautes moyennes (levenshtein 3 sur ~20 chars) -> score partiel (10)
      expect(evaluateAnswer("Le soleile se couhe.", question).earnedPoints).toBe(10);
      
      // Fautes graves -> 0
      expect(evaluateAnswer("La lune se leve.", question).earnedPoints).toBe(0);
    });

    it('should evaluate rewriting with regex tolerance', () => {
      const question = { 
        type: 'rewriting', 
        points: 5, 
        correctAnswer: "Les lettres.",
        toleranceRegex: "^Les lettres[.!?]?$"
      };

      expect(evaluateAnswer("Les lettres.", question).isCorrect).toBe(true);
      expect(evaluateAnswer("les lettres", question).isCorrect).toBe(true); // case insensitive
      expect(evaluateAnswer("Les lettre", question).isCorrect).toBe(false); // missing 's'
    });
  });

});
