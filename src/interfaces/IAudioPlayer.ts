import { Song } from '../types/song';

export interface PlaybackStatus {
  isPlaying: boolean;
  currentPositionSeconds: number;
  durationSeconds: number;
}

export interface IAudioPlayer {
  loadSong(song: Song): Promise<void>;
  play(): void;
  pause(): void;
  seekTo(seconds: number): void;
  stop(): void;
  release(): void;
  onStatusChange(listener: (status: PlaybackStatus) => void): () => void;
  onTrackEnded(listener: () => void): () => void;
  onRemoteNext?(listener: () => void): () => void;
  onRemotePrevious?(listener: () => void): () => void;
}
