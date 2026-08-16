import { createContext, useContext } from 'react';
import { PlaybackStatus } from '../interfaces/IAudioPlayer';
import { PlaybackMode } from '../interfaces/IPlaybackStrategy';
import { Song } from '../types/song';

export type { PlaybackMode };

export interface PlayerContextType {
  currentSong: Song | null;
  songsQueue: Song[];
  currentIndex: number;
  playbackStatus: PlaybackStatus;
  playbackMode: PlaybackMode;
  isModalOpen: boolean;
  isMiniPlayerVisible: boolean;
  isQueueOpen: boolean;
  setQueue: (songs: Song[]) => void;
  OpenPlayer: (song: Song, queue?: Song[]) => void;
  ClosePlayer: () => void;
  openFullPlayer: () => void;
  playSong: (song: Song) => Promise<void>;
  playNextSong: () => void;
  playPreviousSong: () => void;
  seekForward10: () => void;
  seekBackward10: () => void;
  togglePlayPause: () => void;
  togglePlaybackMode: () => void;
  seekTo: (seconds: number) => void;
  closeAndStopPlayer: () => void;
  setIsQueueOpen: (open: boolean) => void;
}

export const PlayerContext = createContext<PlayerContextType>({
  currentSong: null,
  songsQueue: [],
  currentIndex: -1,
  playbackStatus: { isPlaying: false, currentPositionSeconds: 0, durationSeconds: 0 },
  playbackMode: 'sequential',
  isModalOpen: false,
  isMiniPlayerVisible: false,
  isQueueOpen: false,
  setQueue: () => {},
  OpenPlayer: () => {},
  ClosePlayer: () => {},
  openFullPlayer: () => {},
  playSong: async () => {},
  playNextSong: () => {},
  playPreviousSong: () => {},
  seekForward10: () => {},
  seekBackward10: () => {},
  togglePlayPause: () => {},
  togglePlaybackMode: () => {},
  seekTo: () => {},
  closeAndStopPlayer: () => {},
  setIsQueueOpen: () => {},
});

export const usePlayerContext = () => useContext(PlayerContext);
