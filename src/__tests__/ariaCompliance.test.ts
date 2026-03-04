import { describe, it, expect } from 'vitest';
import { getAriaMockResponse } from '../services/aria/ariaMock';

describe('ARIA Compliance (Mock Mode)', () => {
  
  it('should mark all mock responses with isMock: true', () => {
    const response = getAriaMockResponse("Thalès");
    expect(response.isMock).toBe(true);
  });

  it('should use SOURCE_DEMONSTRATION as source name', () => {
    const response = getAriaMockResponse("Thalès");
    expect(response.citations[0].source).toBe("SOURCE_DEMONSTRATION");
  });

  it('should not mention "Bulletin Officiel" in mock excerpt', () => {
    const response = getAriaMockResponse("Thalès");
    expect(response.citations[0].excerpt.toLowerCase()).not.toContain("bulletin officiel");
  });

  it('should have a limited confidence score (<= 0.6)', () => {
    const response = getAriaMockResponse("Thalès");
    expect(response.confidence).toBeLessThanOrEqual(0.6);
  });

});
