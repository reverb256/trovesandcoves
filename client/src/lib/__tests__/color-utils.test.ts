import { getWCAGCompliantColor, isBrandColorLargeEnough } from '../color-utils';

describe('WCAG Color Utilities', () => {
  describe('getWCAGCompliantColor', () => {
    it('should return WCAG compliant turquoise for small text', () => {
      const result = getWCAGCompliantColor('turquoise', 14);
      expect(result).toBe('hsl(174 70% 30%)'); // WCAG AA compliant
    });

    it('should return brand turquoise for large text (18px+)', () => {
      const result = getWCAGCompliantColor('turquoise', 24);
      expect(result).toBe('#4abfbf'); // Brand color OK for large text
    });

    it('should return WCAG compliant gold for small text', () => {
      const result = getWCAGCompliantColor('gold', 14);
      expect(result).toBe('hsl(38 80% 35%)'); // WCAG AA compliant
    });

    it('should return brand gold for large text (18px+)', () => {
      const result = getWCAGCompliantColor('gold', 24);
      expect(result).toBe('#e1af2f'); // Brand color OK for large text
    });

    it('should return brand color for exactly 18px text', () => {
      const turquoiseResult = getWCAGCompliantColor('turquoise', 18);
      expect(turquoiseResult).toBe('#4abfbf');

      const goldResult = getWCAGCompliantColor('gold', 18);
      expect(goldResult).toBe('#e1af2f');
    });

    it('should return WCAG compliant variant for gold1', () => {
      const smallResult = getWCAGCompliantColor('gold1', 14);
      expect(smallResult).toBe('hsl(43 78% 35%)');

      const largeResult = getWCAGCompliantColor('gold1', 24);
      expect(largeResult).toBe('#deb55b');
    });

    it('should return WCAG compliant variant for gold2', () => {
      const smallResult = getWCAGCompliantColor('gold2', 14);
      expect(smallResult).toBe('hsl(38 80% 35%)');

      const largeResult = getWCAGCompliantColor('gold2', 24);
      expect(largeResult).toBe('#e1af2f');
    });
  });

  describe('isBrandColorLargeEnough', () => {
    it('should return true for text 18px or larger', () => {
      expect(isBrandColorLargeEnough(18)).toBe(true);
      expect(isBrandColorLargeEnough(24)).toBe(true);
      expect(isBrandColorLargeEnough(48)).toBe(true);
    });

    it('should return false for text smaller than 18px', () => {
      expect(isBrandColorLargeEnough(14)).toBe(false);
      expect(isBrandColorLargeEnough(16)).toBe(false);
      expect(isBrandColorLargeEnough(12)).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(isBrandColorLargeEnough(17.9)).toBe(false);
      expect(isBrandColorLargeEnough(18.0)).toBe(true);
      expect(isBrandColorLargeEnough(18.1)).toBe(true);
    });
  });
});
