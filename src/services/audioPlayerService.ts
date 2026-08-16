import Sound from 'react-native-sound';
import { IAudioPlayer, PlaybackStatus } from '../interfaces/IAudioPlayer';
import { Song } from '../types/song';

/**
 * Single Responsibility: Manage audio playback with background audio capability.
 * Implements IAudioPlayer contract (DIP / OCP / ISP).
 */
export class AudioPlayerService implements IAudioPlayer {
  private currentSound: Sound | null = null;
  private currentSong: Song | null = null;
  private isPlaying: boolean = false;
  private currentPosition: number = 0;
  private duration: number = 0;
  private timer: ReturnType<typeof setInterval> | null = null;
  private listeners: Set<(status: PlaybackStatus) => void> = new Set();
  private endListeners: Set<() => void> = new Set();

  constructor() {
    // Enable background playback category on iOS
    Sound.setCategory('Playback', true);
  }

  private notifyStatus(): void {
    const status: PlaybackStatus = {
      isPlaying: this.isPlaying,
      currentPositionSeconds: this.currentPosition,
      durationSeconds: this.duration,
    };
    this.listeners.forEach(listener => listener(status));
  }

  private notifyEnded(): void {
    this.endListeners.forEach(listener => listener());
  }

  private startProgressTracker(): void {
    this.stopProgressTracker();
    this.timer = setInterval(() => {
      if (this.currentSound && this.isPlaying) {
        this.currentSound.getCurrentTime(seconds => {
          this.currentPosition = seconds;
          this.notifyStatus();
        });
      }
    }, 500);
  }

  private stopProgressTracker(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  async loadSong(song: Song): Promise<void> {
    if (this.currentSong?.path === song.path && this.currentSound) {
      return;
    }

    this.release();
    this.currentSong = song;

    if (!song.path) {
      return;
    }

    const isRemote =
      song.path.startsWith('http://') || song.path.startsWith('https://');
    const basePath = isRemote ? undefined : '';

    return new Promise((resolve, reject) => {
      const sound = new Sound(song.path, basePath as string, error => {
        if (error) {
          console.warn('[AudioPlayerService] Sound loading issue:', error);
          reject(error);
          return;
        }

        this.currentSound = sound;
        this.duration = sound.getDuration();
        this.currentPosition = 0;
        this.isPlaying = false;
        this.notifyStatus();
        resolve();
      });
    });
  }

  play(): void {
    if (!this.currentSound) {
      return;
    }

    this.isPlaying = true;
    this.startProgressTracker();
    this.notifyStatus();

    this.currentSound.play(success => {
      if (success) {
        this.isPlaying = false;
        this.currentPosition = 0;
        this.stopProgressTracker();
        this.notifyStatus();
        this.notifyEnded();
      } else {
        console.warn('[AudioPlayerService] Playback stopped or failed');
        this.isPlaying = false;
        this.stopProgressTracker();
        this.notifyStatus();
      }
    });
  }

  pause(): void {
    if (this.currentSound && this.isPlaying) {
      this.currentSound.pause();
      this.isPlaying = false;
      this.stopProgressTracker();
      this.notifyStatus();
    }
  }

  seekTo(seconds: number): void {
    if (this.currentSound) {
      this.currentSound.setCurrentTime(seconds);
      this.currentPosition = seconds;
      this.notifyStatus();
    }
  }

  stop(): void {
    if (this.currentSound) {
      this.currentSound.stop();
      this.isPlaying = false;
      this.currentPosition = 0;
      this.stopProgressTracker();
      this.notifyStatus();
    }
  }

  release(): void {
    this.stopProgressTracker();
    if (this.currentSound) {
      this.currentSound.release();
      this.currentSound = null;
    }
    this.isPlaying = false;
    this.currentPosition = 0;
    this.duration = 0;
    this.currentSong = null;
    this.notifyStatus();
  }

  onStatusChange(listener: (status: PlaybackStatus) => void): () => void {
    this.listeners.add(listener);
    listener({
      isPlaying: this.isPlaying,
      currentPositionSeconds: this.currentPosition,
      durationSeconds: this.duration,
    });

    return () => {
      this.listeners.delete(listener);
    };
  }

  onTrackEnded(listener: () => void): () => void {
    this.endListeners.add(listener);
    return () => {
      this.endListeners.delete(listener);
    };
  }
}

export const audioPlayerService = new AudioPlayerService();
