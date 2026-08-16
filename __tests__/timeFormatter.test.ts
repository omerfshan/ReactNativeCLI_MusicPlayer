import { formatDuration, formatTimeSeconds, parseDurationToSeconds } from '../src/utils/timeFormatter';

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

  describe('parseDurationToSeconds', () => {
    it('parses MM:SS string correctly', () => {
      expect(parseDurationToSeconds('3:20')).toBe(200);
      expect(parseDurationToSeconds('1:05')).toBe(65);
      expect(parseDurationToSeconds('0:45')).toBe(45);
    });

    it('returns 0 for invalid or empty inputs', () => {
      expect(parseDurationToSeconds(undefined)).toBe(0);
      expect(parseDurationToSeconds('')).toBe(0);
    });
  });
});
