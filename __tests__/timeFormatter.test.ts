import { formatDuration, formatTimeSeconds } from '../src/utils/timeFormatter';

describe('timeFormatter utils', () => {
  describe('formatDuration', () => {
    it('returns undefined for null or undefined input', () => {
      expect(formatDuration(undefined)).toBeUndefined();
    });

    it('formats seconds into MM:SS format correctly', () => {
      expect(formatDuration(200)).toBe('3:20');
      expect(formatDuration(65)).toBe('1:05');
      expect(formatDuration(0)).toBe('0:00');
    });
  });

  describe('formatTimeSeconds', () => {
    it('returns 0:00 for negative or NaN values', () => {
      expect(formatTimeSeconds(-10)).toBe('0:00');
      expect(formatTimeSeconds(NaN)).toBe('0:00');
    });

    it('formats seconds correctly', () => {
      expect(formatTimeSeconds(125)).toBe('2:05');
      expect(formatTimeSeconds(45)).toBe('0:45');
    });
  });
});
