import React, { createContext, useContext, useState, useCallback } from 'react';
import { Modal } from 'react-native';
import PlayerScreen from '../screens/PlayerScreen';
import { Song } from '../types/song';

type ContextType = {
  openPlayer: (song: Song) => void;
  closePlayer: () => void;
};

const PlayerContext = createContext<ContextType>({
  openPlayer: () => {},
  closePlayer: () => {},
});

export const usePlayerSheet = () => useContext(PlayerContext);

export const PlayerSheetProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [visible, setVisible] = useState(false);
  const [song, setSong] = useState<Song | null>(null);

  const openPlayer = useCallback((s: Song) => {
    setSong(s);
    setVisible(true);
  }, []);

  const closePlayer = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        openPlayer,
        closePlayer,
      }}
    >
      {children}

      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="fullScreen"
        statusBarTranslucent
        onRequestClose={closePlayer}
      >
        <PlayerScreen song={song} />
      </Modal>
    </PlayerContext.Provider>
  );
};
