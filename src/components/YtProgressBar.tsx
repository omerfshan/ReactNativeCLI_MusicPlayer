import React, { useEffect, useRef, useState } from 'react';
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  PanResponder,
  PanResponderGestureState,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface YtProgressBarProps {
  currentSeconds: number;
  durationSeconds: number;
  onSlidingStart?: () => void;
  onSlidingChange?: (seconds: number) => void;
  onSeek: (seconds: number) => void;
  trackColor?: string;
  fillColor?: string;
}

export default function YtProgressBar({
  currentSeconds,
  durationSeconds,
  onSlidingStart,
  onSlidingChange,
  onSeek,
  trackColor,
  fillColor,
}: YtProgressBarProps) {
  const { colors } = useTheme();
  const [isPressing, setIsPressing] = useState(false);
  const [dragRatio, setDragRatio] = useState<number | null>(null);

  const containerRef = useRef<View>(null);
  const containerWidthRef = useRef<number>(300);
  const touchStartLocationXRef = useRef<number>(0);
  const releaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const duration = Math.max(1, durationSeconds || 1);
  const currentRatio = Math.min(1, Math.max(0, currentSeconds / duration));
  const activeRatio = dragRatio !== null ? dragRatio : currentRatio;
  const percentage = Math.min(100, Math.max(0, activeRatio * 100));

  const effectiveTrackColor = trackColor || colors.progressTrack;
  const effectiveFillColor = fillColor || colors.progressFill;

  // Auto-reset dragRatio when track duration or position changes if not actively dragging
  useEffect(() => {
    if (!isPressing && releaseTimerRef.current === null) {
      setDragRatio(null);
    }
  }, [currentSeconds, durationSeconds, isPressing]);

  const calculateRatioFromLocationX = (locationX: number): number => {
    const width = containerWidthRef.current > 0 ? containerWidthRef.current : 300;
    return Math.min(1, Math.max(0, locationX / width));
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (
        evt: GestureResponderEvent,
        _gestureState: PanResponderGestureState,
      ) => {
        if (releaseTimerRef.current) {
          clearTimeout(releaseTimerRef.current);
          releaseTimerRef.current = null;
        }
        setIsPressing(true);
        onSlidingStart?.();

        const startX = evt.nativeEvent.locationX || 0;
        touchStartLocationXRef.current = startX;

        const ratio = calculateRatioFromLocationX(startX);
        setDragRatio(ratio);
        onSlidingChange?.(ratio * duration);
      },
      onPanResponderMove: (
        _evt: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        const currentX = touchStartLocationXRef.current + gestureState.dx;
        const ratio = calculateRatioFromLocationX(currentX);
        setDragRatio(ratio);
        onSlidingChange?.(ratio * duration);
      },
      onPanResponderRelease: (
        _evt: GestureResponderEvent,
        gestureState: PanResponderGestureState,
      ) => {
        setIsPressing(false);
        const finalX = touchStartLocationXRef.current + gestureState.dx;
        const finalRatio = calculateRatioFromLocationX(finalX);
        const targetSeconds = finalRatio * duration;

        setDragRatio(finalRatio);
        onSeek(targetSeconds);

        if (releaseTimerRef.current) {
          clearTimeout(releaseTimerRef.current);
        }
        releaseTimerRef.current = setTimeout(() => {
          setDragRatio(null);
          releaseTimerRef.current = null;
        }, 400);
      },
      onPanResponderTerminate: () => {
        setIsPressing(false);
        setDragRatio(null);
        if (releaseTimerRef.current) {
          clearTimeout(releaseTimerRef.current);
          releaseTimerRef.current = null;
        }
      },
    }),
  ).current;

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    if (width > 0) {
      containerWidthRef.current = width;
    }
  };

  return (
    <View
      ref={containerRef}
      onLayout={handleLayout}
      {...panResponder.panHandlers}
      className="w-full py-4 justify-center"
      hitSlop={{ top: 20, bottom: 20, left: 0, right: 0 }}
    >
      {/* Track Background */}
      <View
        pointerEvents="none"
        className="w-full rounded-full overflow-hidden"
        style={{
          height: isPressing ? 8 : 4,
          backgroundColor: effectiveTrackColor,
        }}
      >
        {/* Filled Progress Track */}
        <View
          pointerEvents="none"
          className="h-full rounded-full"
          style={{
            width: `${percentage}%`,
            backgroundColor: effectiveFillColor,
          }}
        />
      </View>
    </View>
  );
}
