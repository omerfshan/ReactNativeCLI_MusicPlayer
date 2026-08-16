import {
  SequentialStrategy,
  ShuffleStrategy,
  RepeatStrategy,
  PlaybackStrategyFactory,
} from '../src/services/playbackModeStrategy';
import { QueueManager } from '../src/services/queueManager';
import { Song } from '../src/types/song';

describe('SOLID Playback Strategies & QueueManager', () => {
  const dummyQueue: Song[] = [
    { path: '/song1.mp3', name: 'Song 1', duration: '3:00', durationSeconds: 180 },
    { path: '/song2.mp3', name: 'Song 2', duration: '2:30', durationSeconds: 150 },
    { path: '/song3.mp3', name: 'Song 3', duration: '4:00', durationSeconds: 240 },
  ];

  describe('SequentialStrategy (SRP)', () => {
    const strategy = new SequentialStrategy();

    it('advances to next index sequentially', () => {
      expect(strategy.getNext(0, dummyQueue)).toEqual({ nextIndex: 1, shouldRestartTrack: false });
      expect(strategy.getNext(1, dummyQueue)).toEqual({ nextIndex: 2, shouldRestartTrack: false });
      expect(strategy.getNext(2, dummyQueue)).toEqual({ nextIndex: 0, shouldRestartTrack: false });
    });

    it('goes to previous index or restarts track if > 3s', () => {
      expect(strategy.getPrevious(1, 1, dummyQueue)).toEqual({ nextIndex: 0, shouldRestartTrack: false });
      expect(strategy.getPrevious(1, 5, dummyQueue)).toEqual({ nextIndex: 1, shouldRestartTrack: true });
    });
  });

  describe('RepeatStrategy (SRP)', () => {
    const strategy = new RepeatStrategy();

    it('always repeats current song from start', () => {
      expect(strategy.getNext(1, dummyQueue)).toEqual({ nextIndex: 1, shouldRestartTrack: true });
      expect(strategy.getPrevious(1, 20, dummyQueue)).toEqual({ nextIndex: 1, shouldRestartTrack: true });
    });
  });

  describe('ShuffleStrategy (SRP)', () => {
    const strategy = new ShuffleStrategy();

    it('picks a valid index from queue', () => {
      const result = strategy.getNext(0, dummyQueue);
      expect(result.nextIndex).toBeGreaterThanOrEqual(0);
      expect(result.nextIndex).toBeLessThan(dummyQueue.length);
    });
  });

  describe('PlaybackStrategyFactory (OCP / DIP)', () => {
    it('returns appropriate strategy instance for mode', () => {
      expect(PlaybackStrategyFactory.getStrategy('sequential')).toBeInstanceOf(SequentialStrategy);
      expect(PlaybackStrategyFactory.getStrategy('shuffle')).toBeInstanceOf(ShuffleStrategy);
      expect(PlaybackStrategyFactory.getStrategy('repeat')).toBeInstanceOf(RepeatStrategy);
    });
  });

  describe('QueueManager (SRP / ISP)', () => {
    const queueMgr = new QueueManager();

    it('finds song index by path', () => {
      expect(queueMgr.findSongIndex(dummyQueue, dummyQueue[1])).toBe(1);
      expect(queueMgr.findSongIndex(dummyQueue, { path: '/unknown.mp3', name: 'Unknown' })).toBe(-1);
    });

    it('appends song to queue if missing and returns correct index', () => {
      const newSong: Song = { path: '/song4.mp3', name: 'Song 4' };
      const { updatedQueue, index } = queueMgr.appendIfMissing(dummyQueue, newSong);
      expect(updatedQueue).toHaveLength(4);
      expect(index).toBe(3);
    });
  });
});
