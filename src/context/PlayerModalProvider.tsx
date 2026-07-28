import React, { createContext, useContext, useState, useCallback } from 'react';
import { Modal } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import PlayerScreen from '../screens/PlayerScreen';
import { Song } from '../types/song';

type PlayerScreenType = {
  OpenPlayer: (song: Song) => void;
  ClosePlayer: () => void;
};

const PlayerContext = createContext<PlayerScreenType>({
  OpenPlayer: (song: Song) => {},
  ClosePlayer: () => {},
});

export const usePlayerContext = () => useContext(PlayerContext);

export const PlayerModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [visible, setVisible] = useState(false);
  const [song, setSong] = useState<Song | null>(null);

  const OpenPlayer = useCallback((s: Song) => {
    setSong(s);
    setVisible(true);
  }, []);

  const ClosePlayer = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        OpenPlayer,
        ClosePlayer,
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
          <PlayerScreen song={song} />
        </SafeAreaProvider>
      </Modal>
    </PlayerContext.Provider>
  );
};
