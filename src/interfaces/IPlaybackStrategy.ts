import { Song } from '../types/song';

export type PlaybackMode = 'sequential' | 'shuffle' | 'repeat';

export interface NavigationResult {
  nextIndex: number;
  shouldRestartTrack: boolean;
}

/**
 * Open/Closed Principle (OCP): Interface contract for playback navigation strategies.
 * Allows extending new playback behaviors without modifying the player context.
 */
export interface IPlaybackStrategy {
  getNext(currentIndex: number, queue: Song[]): NavigationResult;
  getPrevious(
    currentIndex: number,
    currentPositionSeconds: number,
    queue: Song[],
  ): NavigationResult;
}
