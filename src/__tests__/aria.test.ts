import { describe, it, expect } from 'vitest';
import { AriaQueryRequestSchema, AriaResponseSchema } from '../services/aria/types';
import { buildAriaRAGPrompt } from '../services/aria/ariaPromptBuilder';
import { getAriaMockResponse } from '../services/aria/ariaMock';

describe('Aria Mentor Module', () => {
  
  it('should validate a correct AriaQueryRequest', () => {
    const validRequest = {
      query: "Explique moi Thalès",
      context: { subject: "Maths" },
      studentProfile: {
        rank: "Apprenti",
        mastery: 45,
        bloomLevel: "N2"
      }
    };
    expect(() => AriaQueryRequestSchema.parse(validRequest)).not.toThrow();
  });

  it('should throw error for invalid request', () => {
    const invalidRequest = { query: "" };
    expect(() => AriaQueryRequestSchema.parse(invalidRequest)).toThrow();
  });

  it('should build a prompt adapted to student mastery', () => {
    const request = {
      query: "Test",
      context: { subject: "Test" },
      studentProfile: { rank: "Expert", mastery: 90, bloomLevel: "N4" }
    };
    const messages = buildAriaRAGPrompt(request, []);
    expect(messages[0].content).toContain("Expert");
  });

  it('should return specific mock for Thalès query', () => {
    const response = getAriaMockResponse("Peux-tu m'aider sur Thalès ?");
    expect(response.answerMarkdown).toContain("simulée");
    expect(response.citations.length).toBeGreaterThan(0);
    expect(() => AriaResponseSchema.parse(response)).not.toThrow();
  });

});
