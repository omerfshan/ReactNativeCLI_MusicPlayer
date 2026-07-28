// context/PlayerSheetContext.tsx
import React, {
  createContext,
  useContext,
  useRef,
  useCallback,
  useState,
  useMemo,
} from 'react';
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import PlayerScreen from '../screens/PlayerScreen';
import { Song } from '../types/song';

type Ctx = { openPlayer: (song: Song) => void; closePlayer: () => void };
const PlayerSheetContext = createContext<Ctx>({
  openPlayer: () => {},
  closePlayer: () => {},
});

export const usePlayerSheet = () => useContext(PlayerSheetContext);

export const PlayerSheetProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const sheetRef = useRef<BottomSheet>(null);
  const [song, setSong] = useState<Song | null>(null);

  const snapPoints = useMemo(() => ['92%'], []);

  const openPlayer = useCallback((s: Song) => {
    setSong(s);
    sheetRef.current?.expand();
  }, []);

  const closePlayer = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.6}
      />
    ),
    [],
  );

  return (
    <PlayerSheetContext.Provider value={{ openPlayer, closePlayer }}>
      {children}

      <BottomSheet
        ref={sheetRef}
        index={-1} // başlangıçta kapalı
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: 'rgba(255,255,255,0.4)' }}
        backgroundStyle={{ backgroundColor: '#6b5b73' }}
      >
        <BottomSheetView style={{ flex: 1 }}>
          <PlayerScreen song={song} />
        </BottomSheetView>
      </BottomSheet>
    </PlayerSheetContext.Provider>
  );
};
