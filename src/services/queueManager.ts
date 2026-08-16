import { Song } from '../types/song';

/**
 * Interface Segregation Principle (ISP): Contract for queue management operations.
 */
export interface IQueueManager {
  findSongIndex(queue: Song[], song: Song): number;
  appendIfMissing(queue: Song[], song: Song): { updatedQueue: Song[]; index: number };
}

/**
 * Single Responsibility Principle (SRP): Pure domain logic for playlist queue operations.
 */
export class QueueManager implements IQueueManager {
  findSongIndex(queue: Song[], song: Song): number {
    return queue.findIndex(s => s.path === song.path);
  }

  appendIfMissing(
    queue: Song[],
    song: Song,
  ): { updatedQueue: Song[]; index: number } {
    const existingIndex = this.findSongIndex(queue, song);
    if (existingIndex !== -1) {
      return { updatedQueue: queue, index: existingIndex };
    }
    const updatedQueue = [...queue, song];
    return { updatedQueue, index: updatedQueue.length - 1 };
  }
}

export const queueManager = new QueueManager();
