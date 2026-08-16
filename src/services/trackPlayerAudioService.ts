import TrackPlayer, {
  Capability,
  Event,
  State,
} from 'react-native-track-player';
import { IAudioPlayer, PlaybackStatus } from '../interfaces/IAudioPlayer';
import { Song } from '../types/song';

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
      await this.notifyStatus();
    }, 500);
  }

  private stopProgressTracker(): void {
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
      this.progressTimer = null;
    }
  }

  private async notifyStatus(): Promise<void> {
    try {
      const state = await TrackPlayer.getPlaybackState();
      const progress = await TrackPlayer.getProgress();

      const isPlaying = state.state === State.Playing || state.state === State.Buffering;
      const status: PlaybackStatus = {
        isPlaying,
        currentPositionSeconds: progress.position || 0,
        durationSeconds: progress.duration || 0,
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

    await TrackPlayer.add({
      id: song.path,
      url: trackUrl,
      title: song.name || 'Bilinmeyen Şarkı',
      artist: song.artist || 'Bilinmeyen Sanatçı',
      artwork: song.artwork || undefined,
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
    await TrackPlayer.seekTo(seconds);
    await this.notifyStatus();
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
