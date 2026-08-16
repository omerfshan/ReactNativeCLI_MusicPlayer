import {
  IPlaybackStrategy,
  NavigationResult,
  PlaybackMode,
} from '../interfaces/IPlaybackStrategy';
import { Song } from '../types/song';

/**
 * Single Responsibility: Sequential playback mode logic (0 -> 1 -> 2 -> 3).
 */
export class SequentialStrategy implements IPlaybackStrategy {
  getNext(currentIndex: number, queue: Song[]): NavigationResult {
    if (queue.length === 0) {
      return { nextIndex: -1, shouldRestartTrack: false };
    }
    const nextIndex = (currentIndex + 1) % queue.length;
    return { nextIndex, shouldRestartTrack: false };
  }

  getPrevious(
    currentIndex: number,
    currentPositionSeconds: number,
    queue: Song[],
  ): NavigationResult {
    if (queue.length === 0) {
      return { nextIndex: -1, shouldRestartTrack: false };
    }
    // If track has been playing for > 3 seconds, previous button restarts track
    if (currentPositionSeconds > 3) {
      return { nextIndex: currentIndex, shouldRestartTrack: true };
    }
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    return { nextIndex: prevIndex, shouldRestartTrack: false };
  }
}

/**
 * Single Responsibility: Shuffle random playback mode logic.
 */
export class ShuffleStrategy implements IPlaybackStrategy {
  getNext(currentIndex: number, queue: Song[]): NavigationResult {
    if (queue.length <= 1) {
      return { nextIndex: 0, shouldRestartTrack: queue.length === 1 };
    }
    let nextIndex = Math.floor(Math.random() * queue.length);
    if (nextIndex === currentIndex) {
      nextIndex = (currentIndex + 1) % queue.length;
    }
    return { nextIndex, shouldRestartTrack: false };
  }

  getPrevious(
    currentIndex: number,
    currentPositionSeconds: number,
    queue: Song[],
  ): NavigationResult {
    if (queue.length === 0) {
      return { nextIndex: -1, shouldRestartTrack: false };
    }
    if (currentPositionSeconds > 3) {
      return { nextIndex: currentIndex, shouldRestartTrack: true };
    }
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    return { nextIndex: prevIndex, shouldRestartTrack: false };
  }
}

/**
 * Single Responsibility: Repeat single track playback mode logic.
 */
export class RepeatStrategy implements IPlaybackStrategy {
  getNext(currentIndex: number, queue: Song[]): NavigationResult {
    if (queue.length === 0) {
      return { nextIndex: -1, shouldRestartTrack: false };
    }
    return { nextIndex: currentIndex, shouldRestartTrack: true };
  }

  getPrevious(
    currentIndex: number,
    _currentPositionSeconds: number,
    queue: Song[],
  ): NavigationResult {
    if (queue.length === 0) {
      return { nextIndex: -1, shouldRestartTrack: false };
    }
    return { nextIndex: currentIndex, shouldRestartTrack: true };
  }
}

/**
 * Factory implementing Dependency Inversion & Open/Closed Principle.
 */
export class PlaybackStrategyFactory {
  private static strategies: Record<PlaybackMode, IPlaybackStrategy> = {
    sequential: new SequentialStrategy(),
    shuffle: new ShuffleStrategy(),
    repeat: new RepeatStrategy(),
  };

  static getStrategy(mode: PlaybackMode): IPlaybackStrategy {
    return this.strategies[mode] || this.strategies.sequential;
  }
}
