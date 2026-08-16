import React, { useRef, useState } from 'react';
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  PanResponder,
  View,
} from 'react-native';

interface YtProgressBarProps {
  currentSeconds: number;
  durationSeconds: number;
  onSeek: (seconds: number) => void;
}

export default function YtProgressBar({
  currentSeconds,
  durationSeconds,
  onSeek,
}: YtProgressBarProps) {
  const [isPressing, setIsPressing] = useState(false);
  const [dragRatio, setDragRatio] = useState<number | null>(null);
  const containerRef = useRef<View>(null);
  const layoutRef = useRef<{ pageX: number; width: number }>({
    pageX: 0,
    width: 1,
  });
  const releaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const duration = Math.max(1, durationSeconds || 1);
  const currentRatio = Math.min(1, Math.max(0, currentSeconds / duration));
  const activeRatio = dragRatio !== null ? dragRatio : currentRatio;
  const percentage = Math.min(100, Math.max(0, activeRatio * 100));

  const measureContainer = () => {
    containerRef.current?.measure((x, y, width, height, pageX) => {
      if (width > 0) {
        layoutRef.current = { pageX, width };
      }
    });
  };

  const calculateRatioFromPageX = (pageX: number): number => {
    const { pageX: startX, width } = layoutRef.current;
    if (width > 0) {
      const relativeX = pageX - startX;
      const ratio = Math.min(1, Math.max(0, relativeX / width));
      return ratio;
    }
    return 0;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        if (releaseTimerRef.current) {
          clearTimeout(releaseTimerRef.current);
          releaseTimerRef.current = null;
        }
        setIsPressing(true);
        measureContainer();
        const ratio = calculateRatioFromPageX(evt.nativeEvent.pageX);
        setDragRatio(ratio);
      },
      onPanResponderMove: (evt: GestureResponderEvent) => {
        const ratio = calculateRatioFromPageX(evt.nativeEvent.pageX);
        setDragRatio(ratio);
      },
      onPanResponderRelease: (evt: GestureResponderEvent) => {
        setIsPressing(false);
        const finalRatio = calculateRatioFromPageX(evt.nativeEvent.pageX);
        const targetSeconds = finalRatio * duration;
        setDragRatio(finalRatio);
        onSeek(targetSeconds);

        // Keep optimistic position briefly while native player seeks
        if (releaseTimerRef.current) {
          clearTimeout(releaseTimerRef.current);
        }
        releaseTimerRef.current = setTimeout(() => {
          setDragRatio(null);
        }, 1200);
      },
      onPanResponderTerminate: () => {
        setIsPressing(false);
        setDragRatio(null);
      },
    }),
  ).current;

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    layoutRef.current.width = width;
    measureContainer();
  };

  return (
    <View
      ref={containerRef}
      onLayout={handleLayout}
      {...panResponder.panHandlers}
      className="w-full py-4 justify-center"
      hitSlop={{ top: 12, bottom: 12, left: 0, right: 0 }}
    >
      {/* Track Background */}
      <View
        className="w-full bg-white/20 rounded-full overflow-hidden"
        style={{
          height: isPressing ? 8 : 4,
        }}
      >
        {/* Filled Progress Track */}
        <View
          className="bg-white h-full rounded-full"
          style={{
            width: `${percentage}%`,
          }}
        />
      </View>
    </View>
  );
}
