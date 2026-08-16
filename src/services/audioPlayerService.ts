import Sound from 'react-native-sound';
import { IAudioPlayer, PlaybackStatus } from '../interfaces/IAudioPlayer';
import { Song } from '../types/song';

/**
 * Single Responsibility: Manage audio playback using react-native-sound.
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

  constructor() {
    Sound.setCategory('Playback');
  }

  private notifyStatus(): void {
    const status: PlaybackStatus = {
      isPlaying: this.isPlaying,
      currentPositionSeconds: this.currentPosition,
      durationSeconds: this.duration,
    };
    this.listeners.forEach(listener => listener(status));
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

    return new Promise((resolve, reject) => {
      const sound = new Sound(song.path, '', error => {
        if (error) {
          console.error('[AudioPlayerService] Sound loading error:', error);
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
      } else {
        console.error('[AudioPlayerService] Playback finished with error');
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
}

export const audioPlayerService = new AudioPlayerService();
