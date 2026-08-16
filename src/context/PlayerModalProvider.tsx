import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Modal } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import QueueModal from '../components/QueueModal';
import { IAudioPlayer, PlaybackStatus } from '../interfaces/IAudioPlayer';
import PlayerScreen from '../screens/PlayerScreen';
import { trackPlayerAudioService } from '../services/trackPlayerAudioService';
import { Song } from '../types/song';

export type PlaybackMode = 'sequential' | 'shuffle' | 'repeat';

interface PlayerContextType {
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

const PlayerContext = createContext<PlayerContextType>({
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

interface PlayerModalProviderProps {
  children: React.ReactNode;
  playerService?: IAudioPlayer;
}

export const PlayerModalProvider: React.FC<PlayerModalProviderProps> = ({
  children,
  playerService = trackPlayerAudioService,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMiniPlayerVisible, setIsMiniPlayerVisible] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [songsQueue, setSongsQueue] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [playbackMode, setPlaybackMode] = useState<PlaybackMode>('sequential');
  const [status, setStatus] = useState<PlaybackStatus>({
    isPlaying: false,
    currentPositionSeconds: 0,
    durationSeconds: 0,
  });

  useEffect(() => {
    const unsubscribe = playerService.onStatusChange(newStatus => {
      setStatus(newStatus);
    });

    return () => {
      unsubscribe();
    };
  }, [playerService]);

  const playSongByIndex = useCallback(
    async (index: number, queue: Song[]) => {
      if (index < 0 || index >= queue.length) {
        return;
      }
      const targetSong = queue[index];
      setCurrentIndex(index);
      setCurrentSong(targetSong);
      setIsMiniPlayerVisible(true);

      try {
        await playerService.loadSong(targetSong);
        playerService.play();
      } catch (err) {
        console.warn('[PlayerModalProvider] Error playing song:', err);
      }
    },
    [playerService],
  );

  const setQueue = useCallback((songs: Song[]) => {
    setSongsQueue(songs);
  }, []);

  const playSong = useCallback(
    async (targetSong: Song) => {
      const idx = songsQueue.findIndex(s => s.path === targetSong.path);
      if (idx !== -1) {
        await playSongByIndex(idx, songsQueue);
      } else {
        const newQueue = [...songsQueue, targetSong];
        setSongsQueue(newQueue);
        await playSongByIndex(newQueue.length - 1, newQueue);
      }
    },
    [playSongByIndex, songsQueue],
  );

  const OpenPlayer = useCallback(
    (targetSong: Song, customQueue?: Song[]) => {
      const activeQueue = customQueue && customQueue.length > 0 ? customQueue : songsQueue;
      if (customQueue && customQueue.length > 0) {
        setSongsQueue(customQueue);
      }

      let idx = activeQueue.findIndex(s => s.path === targetSong.path);
      if (idx === -1) {
        idx = 0;
      }

      playSongByIndex(idx, activeQueue);
      setIsModalOpen(true);
    },
    [playSongByIndex, songsQueue],
  );

  const ClosePlayer = useCallback(() => {
    setIsModalOpen(false);
    if (currentSong) {
      setIsMiniPlayerVisible(true);
    }
  }, [currentSong]);

  const openFullPlayer = useCallback(() => {
    if (currentSong) {
      setIsModalOpen(true);
    }
  }, [currentSong]);

  const playNextSong = useCallback(() => {
    if (songsQueue.length === 0) {
      return;
    }

    // 1. Repeat Mode: repeat current track from 0:00
    if (playbackMode === 'repeat') {
      playerService.seekTo(0);
      playerService.play();
      return;
    }

    // 2. Shuffle Mode: pick a random track
    if (playbackMode === 'shuffle') {
      if (songsQueue.length === 1) {
        playerService.seekTo(0);
        playerService.play();
        return;
      }
      let nextIdx = Math.floor(Math.random() * songsQueue.length);
      if (nextIdx === currentIndex && songsQueue.length > 1) {
        nextIdx = (currentIndex + 1) % songsQueue.length;
      }
      playSongByIndex(nextIdx, songsQueue);
      return;
    }

    // 3. Sequential Mode: play next song in list (0 -> 1 -> 2 -> 3)
    const nextSequentialIdx = (currentIndex + 1) % songsQueue.length;
    playSongByIndex(nextSequentialIdx, songsQueue);
  }, [currentIndex, playSongByIndex, playbackMode, playerService, songsQueue]);

  const playPreviousSong = useCallback(() => {
    if (songsQueue.length === 0) {
      return;
    }

    // Repeat Mode: repeat current playing song from 0:00
    if (playbackMode === 'repeat') {
      playerService.seekTo(0);
      playerService.play();
      return;
    }

    if (status.currentPositionSeconds > 3) {
      playerService.seekTo(0);
      return;
    }

    const prevSequentialIdx = (currentIndex - 1 + songsQueue.length) % songsQueue.length;
    playSongByIndex(prevSequentialIdx, songsQueue);
  }, [currentIndex, playSongByIndex, playbackMode, playerService, songsQueue, status.currentPositionSeconds]);

  // Subscribe to track end event & lockscreen remote Next / Prev events
  useEffect(() => {
    const unsubscribeEnd = playerService.onTrackEnded(() => {
      playNextSong();
    });

    const unsubscribeRemoteNext = playerService.onRemoteNext
      ? playerService.onRemoteNext(() => {
          playNextSong();
        })
      : () => {};

    const unsubscribeRemotePrev = playerService.onRemotePrevious
      ? playerService.onRemotePrevious(() => {
          playPreviousSong();
        })
      : () => {};

    return () => {
      unsubscribeEnd();
      unsubscribeRemoteNext();
      unsubscribeRemotePrev();
    };
  }, [playNextSong, playPreviousSong, playerService]);

  const seekForward10 = useCallback(() => {
    const target = Math.min(status.durationSeconds || 0, status.currentPositionSeconds + 10);
    playerService.seekTo(target);
  }, [playerService, status.currentPositionSeconds, status.durationSeconds]);

  const seekBackward10 = useCallback(() => {
    const target = Math.max(0, status.currentPositionSeconds - 10);
    playerService.seekTo(target);
  }, [playerService, status.currentPositionSeconds]);

  const togglePlayPause = useCallback(() => {
    if (status.isPlaying) {
      playerService.pause();
    } else {
      playerService.play();
    }
  }, [playerService, status.isPlaying]);

  const togglePlaybackMode = useCallback(() => {
    setPlaybackMode(prev => {
      if (prev === 'sequential') return 'shuffle';
      if (prev === 'shuffle') return 'repeat';
      return 'sequential';
    });
  }, []);

  const seekTo = useCallback(
    (seconds: number) => {
      playerService.seekTo(seconds);
    },
    [playerService],
  );

  const closeAndStopPlayer = useCallback(() => {
    playerService.stop();
    playerService.release();
    setIsModalOpen(false);
    setIsMiniPlayerVisible(false);
    setIsQueueOpen(false);
    setCurrentSong(null);
    setCurrentIndex(-1);
  }, [playerService]);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        songsQueue,
        currentIndex,
        playbackStatus: status,
        playbackMode,
        isModalOpen,
        isMiniPlayerVisible,
        isQueueOpen,
        setQueue,
        OpenPlayer,
        ClosePlayer,
        openFullPlayer,
        playSong,
        playNextSong,
        playPreviousSong,
        seekForward10,
        seekBackward10,
        togglePlayPause,
        togglePlaybackMode,
        seekTo,
        closeAndStopPlayer,
        setIsQueueOpen,
      }}
    >
      {children}

      <Modal
        visible={isModalOpen}
        animationType="slide"
        presentationStyle="fullScreen"
        statusBarTranslucent
        onRequestClose={ClosePlayer}
      >
        <SafeAreaProvider>
          <PlayerScreen />
          <QueueModal />
        </SafeAreaProvider>
      </Modal>
    </PlayerContext.Provider>
  );
};
