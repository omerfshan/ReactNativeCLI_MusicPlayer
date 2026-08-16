import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import { View } from 'react-native';
import QueueModal from '../components/QueueModal';
import { IAudioPlayer, PlaybackStatus } from '../interfaces/IAudioPlayer';
import { PlaybackMode } from '../interfaces/IPlaybackStrategy';
import PlayerScreen from '../screens/PlayerScreen';
import { PlaybackStrategyFactory } from '../services/playbackModeStrategy';
import { IQueueManager, queueManager } from '../services/queueManager';
import { trackPlayerAudioService } from '../services/trackPlayerAudioService';
import { Song } from '../types/song';
import { parseDurationToSeconds } from '../utils/timeFormatter';
import {
  PlayerContext,
  PlayerContextType,
  usePlayerContext,
} from './PlayerContext';

export { PlayerContext, usePlayerContext };
export type { PlaybackMode, PlayerContextType };

interface PlayerModalProviderProps {
  children: React.ReactNode;
  playerService?: IAudioPlayer;
  queueService?: IQueueManager;
}

/**
 * SOLID Refactored Player Provider:
 * - SRP: Acts strictly as State Coordinator between UI, Audio Engine, and Domain Strategies.
 * - OCP: Delegates Next/Previous navigation to IPlaybackStrategy implementations.
 * - LSP / DIP: Depends strictly on IAudioPlayer and IQueueManager abstractions.
 */
export const PlayerModalProvider: React.FC<PlayerModalProviderProps> = ({
  children,
  playerService = trackPlayerAudioService,
  queueService = queueManager,
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

  // Subscribe to audio player status changes (Observer Pattern / SRP)
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
      const targetDuration =
        targetSong.durationSeconds ||
        parseDurationToSeconds(targetSong.duration) ||
        0;

      setCurrentIndex(index);
      setCurrentSong(targetSong);
      setIsMiniPlayerVisible(true);

      // Instantly reset duration to incoming track to prevent stale duration leak
      setStatus({
        isPlaying: true,
        currentPositionSeconds: 0,
        durationSeconds: targetDuration,
      });

      try {
        await playerService.loadSong(targetSong);
        await playerService.play();
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
      const { updatedQueue, index } = queueService.appendIfMissing(
        songsQueue,
        targetSong,
      );
      if (updatedQueue !== songsQueue) {
        setSongsQueue(updatedQueue);
      }
      await playSongByIndex(index, updatedQueue);
    },
    [playSongByIndex, queueService, songsQueue],
  );

  const OpenPlayer = useCallback(
    (targetSong: Song, customQueue?: Song[]) => {
      const activeQueue =
        customQueue && customQueue.length > 0 ? customQueue : songsQueue;
      if (customQueue && customQueue.length > 0) {
        setSongsQueue(customQueue);
      }

      let idx = queueService.findSongIndex(activeQueue, targetSong);
      if (idx === -1) {
        idx = 0;
      }

      playSongByIndex(idx, activeQueue);
      setIsModalOpen(true);
    },
    [playSongByIndex, queueService, songsQueue],
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

  // Strategy Pattern (OCP): Calculate next track using active playback mode strategy
  const playNextSong = useCallback(() => {
    if (songsQueue.length === 0) {
      return;
    }
    const strategy = PlaybackStrategyFactory.getStrategy(playbackMode);
    const result = strategy.getNext(currentIndex, songsQueue);

    if (result.shouldRestartTrack) {
      playerService.seekTo(0);
      playerService.play();
      return;
    }

    if (result.nextIndex !== -1) {
      playSongByIndex(result.nextIndex, songsQueue);
    }
  }, [currentIndex, playSongByIndex, playbackMode, playerService, songsQueue]);

  // Strategy Pattern (OCP): Calculate previous track using active playback mode strategy
  const playPreviousSong = useCallback(() => {
    if (songsQueue.length === 0) {
      return;
    }
    const strategy = PlaybackStrategyFactory.getStrategy(playbackMode);
    const result = strategy.getPrevious(
      currentIndex,
      status.currentPositionSeconds,
      songsQueue,
    );

    if (result.shouldRestartTrack) {
      playerService.seekTo(0);
      playerService.play();
      return;
    }

    if (result.nextIndex !== -1) {
      playSongByIndex(result.nextIndex, songsQueue);
    }
  }, [currentIndex, playSongByIndex, playbackMode, playerService, songsQueue, status.currentPositionSeconds]);

  // Subscribe to native track ending and lockscreen next/prev events
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
    const songDuration =
      currentSong?.durationSeconds ||
      parseDurationToSeconds(currentSong?.duration) ||
      status.durationSeconds ||
      0;
    const target = Math.min(songDuration, status.currentPositionSeconds + 10);
    playerService.seekTo(target);
  }, [currentSong, playerService, status.currentPositionSeconds, status.durationSeconds]);

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

      {/* Full-Screen Player Screen Overlay (Connected to main window for seamless live theme switching) */}
      {isModalOpen && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
            elevation: 999,
          }}
        >
          <PlayerScreen />
          <QueueModal />
        </View>
      )}
    </PlayerContext.Provider>
  );
};
