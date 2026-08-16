import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Modal } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { IAudioPlayer, PlaybackStatus } from '../interfaces/IAudioPlayer';
import PlayerScreen from '../screens/PlayerScreen';
import { audioPlayerService } from '../services/audioPlayerService';
import { Song } from '../types/song';

interface PlayerContextType {
  currentSong: Song | null;
  playbackStatus: PlaybackStatus;
  OpenPlayer: (song: Song) => void;
  ClosePlayer: () => void;
  playSong: (song: Song) => Promise<void>;
  togglePlayPause: () => void;
  seekTo: (seconds: number) => void;
}

const PlayerContext = createContext<PlayerContextType>({
  currentSong: null,
  playbackStatus: { isPlaying: false, currentPositionSeconds: 0, durationSeconds: 0 },
  OpenPlayer: () => {},
  ClosePlayer: () => {},
  playSong: async () => {},
  togglePlayPause: () => {},
  seekTo: () => {},
});

export const usePlayerContext = () => useContext(PlayerContext);

interface PlayerModalProviderProps {
  children: React.ReactNode;
  playerService?: IAudioPlayer;
}

export const PlayerModalProvider: React.FC<PlayerModalProviderProps> = ({
  children,
  playerService = audioPlayerService,
}) => {
  const [visible, setVisible] = useState(false);
  const [song, setSong] = useState<Song | null>(null);
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

  const playSong = useCallback(
    async (targetSong: Song) => {
      try {
        setSong(targetSong);
        await playerService.loadSong(targetSong);
        playerService.play();
      } catch (err) {
        console.error('[PlayerModalProvider] Error playing song:', err);
      }
    },
    [playerService],
  );

  const OpenPlayer = useCallback(
    (s: Song) => {
      playSong(s);
      setVisible(true);
    },
    [playSong],
  );

  const ClosePlayer = useCallback(() => {
    setVisible(false);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (status.isPlaying) {
      playerService.pause();
    } else {
      playerService.play();
    }
  }, [playerService, status.isPlaying]);

  const seekTo = useCallback(
    (seconds: number) => {
      playerService.seekTo(seconds);
    },
    [playerService],
  );

  return (
    <PlayerContext.Provider
      value={{
        currentSong: song,
        playbackStatus: status,
        OpenPlayer,
        ClosePlayer,
        playSong,
        togglePlayPause,
        seekTo,
      }}
    >
      {children}

      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="fullScreen"
        statusBarTranslucent
        onRequestClose={ClosePlayer}
      >
        <SafeAreaProvider>
          <PlayerScreen />
        </SafeAreaProvider>
      </Modal>
    </PlayerContext.Provider>
  );
};
