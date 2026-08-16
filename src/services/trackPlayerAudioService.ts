import TrackPlayer, {
  Capability,
  Event,
  State,
} from 'react-native-track-player';
import { IAudioPlayer, PlaybackStatus } from '../interfaces/IAudioPlayer';
import { Song } from '../types/song';
import { parseDurationToSeconds } from '../utils/timeFormatter';

/**
 * Single Responsibility: Audio player implementation using react-native-track-player.
 * Manages native iOS Control Center, Lock Screen widgets, and Android Notifications.
 * Implements IAudioPlayer interface contract (DIP / OCP / ISP).
 */
export class TrackPlayerAudioService implements IAudioPlayer {
  private isInitialized = false;
  private currentSong: Song | null = null;
  private listeners: Set<(status: PlaybackStatus) => void> = new Set();
  private endListeners: Set<() => void> = new Set();
  private remoteNextListeners: Set<() => void> = new Set();
  private remotePrevListeners: Set<() => void> = new Set();
  private progressTimer: ReturnType<typeof setInterval> | null = null;
  private isSeeking = false;
  private seekTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.initPlayer();
  }

  private async initPlayer(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      await TrackPlayer.setupPlayer({});
      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.SeekTo,
          Capability.Stop,
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],
        notificationCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],
      });

      this.isInitialized = true;
      this.setupEventListeners();
    } catch (error) {
      console.warn('[TrackPlayerAudioService] Setup warning (already setup or error):', error);
      this.isInitialized = true;
    }
  }

  private setupEventListeners(): void {
    TrackPlayer.addEventListener(Event.PlaybackQueueEnded, () => {
      this.notifyEnded();
    });

    TrackPlayer.addEventListener(Event.PlaybackState, () => {
      this.notifyStatus();
    });

    TrackPlayer.addEventListener(Event.RemoteNext, () => {
      this.notifyRemoteNext();
    });

    TrackPlayer.addEventListener(Event.RemotePrevious, () => {
      this.notifyRemotePrevious();
    });

    TrackPlayer.addEventListener(Event.RemotePlay, () => {
      this.play();
    });

    TrackPlayer.addEventListener(Event.RemotePause, () => {
      this.pause();
    });
  }

  private startProgressTracker(): void {
    this.stopProgressTracker();
    this.progressTimer = setInterval(async () => {
      if (!this.isSeeking) {
        await this.notifyStatus();
      }
    }, 500);
  }

  private stopProgressTracker(): void {
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
      this.progressTimer = null;
    }
  }

  private async notifyStatus(overridePosition?: number): Promise<void> {
    try {
      const state = await TrackPlayer.getPlaybackState();
      const progress = await TrackPlayer.getProgress();

      const isPlaying = state.state === State.Playing || state.state === State.Buffering;
      const fallbackDuration =
        this.currentSong?.durationSeconds ||
        parseDurationToSeconds(this.currentSong?.duration) ||
        0;
      const effectiveDuration =
        progress.duration && progress.duration > 0
          ? progress.duration
          : fallbackDuration;

      const status: PlaybackStatus = {
        isPlaying,
        currentPositionSeconds: overridePosition !== undefined ? overridePosition : (progress.position || 0),
        durationSeconds: effectiveDuration,
      };

      this.listeners.forEach(listener => listener(status));
    } catch (e) {
      // Ignore background race errors
    }
  }

  private notifyEnded(): void {
    this.endListeners.forEach(listener => listener());
  }

  private notifyRemoteNext(): void {
    this.remoteNextListeners.forEach(listener => listener());
  }

  private notifyRemotePrevious(): void {
    this.remotePrevListeners.forEach(listener => listener());
  }

  async loadSong(song: Song): Promise<void> {
    await this.initPlayer();

    if (this.currentSong?.path === song.path) {
      return;
    }

    this.currentSong = song;
    await TrackPlayer.reset();

    const trackUrl = song.path.startsWith('http://') || song.path.startsWith('https://') || song.path.startsWith('file://')
      ? song.path
      : `file://${song.path}`;

    const duration =
      song.durationSeconds || parseDurationToSeconds(song.duration) || undefined;

    await TrackPlayer.add({
      id: song.path,
      url: trackUrl,
      title: song.name || 'Bilinmeyen Şarkı',
      artist: song.artist || 'Bilinmeyen Sanatçı',
      artwork: song.artwork || undefined,
      duration: duration,
    });

    await this.notifyStatus();
  }

  async play(): Promise<void> {
    await this.initPlayer();
    await TrackPlayer.play();
    this.startProgressTracker();
    await this.notifyStatus();
  }

  async pause(): Promise<void> {
    await TrackPlayer.pause();
    this.stopProgressTracker();
    await this.notifyStatus();
  }

  async seekTo(seconds: number): Promise<void> {
    this.isSeeking = true;
    if (this.seekTimer) {
      clearTimeout(this.seekTimer);
    }

    try {
      await TrackPlayer.seekTo(seconds);
    } catch (e) {
      console.warn('[TrackPlayerAudioService] Seek error:', e);
    }

    await this.notifyStatus(seconds);

    this.seekTimer = setTimeout(() => {
      this.isSeeking = false;
    }, 1000);
  }

  async stop(): Promise<void> {
    await TrackPlayer.stop();
    this.stopProgressTracker();
    await this.notifyStatus();
  }

  async release(): Promise<void> {
    this.stopProgressTracker();
    await TrackPlayer.reset();
    this.currentSong = null;
    await this.notifyStatus();
  }

  onStatusChange(listener: (status: PlaybackStatus) => void): () => void {
    this.listeners.add(listener);
    this.notifyStatus();

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

  onRemoteNext(listener: () => void): () => void {
    this.remoteNextListeners.add(listener);
    return () => {
      this.remoteNextListeners.delete(listener);
    };
  }

  onRemotePrevious(listener: () => void): () => void {
    this.remotePrevListeners.add(listener);
    return () => {
      this.remotePrevListeners.delete(listener);
    };
  }
}

export const trackPlayerAudioService = new TrackPlayerAudioService();
