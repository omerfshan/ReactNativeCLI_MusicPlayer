/**
 * Single Responsibility: Format seconds into MM:SS display format.
 */
export const formatDuration = (seconds?: number): string | undefined => {
  if (seconds == null || isNaN(seconds) || seconds < 0) {
    return undefined;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const formatTimeSeconds = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) {
    return '0:00';
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};
