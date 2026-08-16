import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface EqualizerAnimationProps {
  isPlaying: boolean;
}

const Bar: React.FC<{ isPlaying: boolean; delay: number; minHeight: number; maxHeight: number }> = ({
  isPlaying,
  delay,
  minHeight,
  maxHeight,
}) => {
  const height = useSharedValue(minHeight);

  useEffect(() => {
    if (isPlaying) {
      height.value = withRepeat(
        withSequence(
          withTiming(maxHeight, { duration: 350 + delay }),
          withTiming(minHeight, { duration: 350 + delay }),
        ),
        -1,
        true,
      );
    } else {
      height.value = withTiming(minHeight, { duration: 200 });
    }
  }, [delay, height, isPlaying, maxHeight, minHeight]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width: 3,
          backgroundColor: '#22c55e',
          borderRadius: 2,
          marginHorizontal: 1,
        },
        animatedStyle,
      ]}
    />
  );
};

export default function EqualizerAnimation({ isPlaying }: EqualizerAnimationProps) {
  return (
    <View className="flex-row items-end justify-center h-5 px-1 bg-black/40 rounded-lg p-0.5 border border-emerald-500/30">
      <Bar isPlaying={isPlaying} delay={50} minHeight={4} maxHeight={16} />
      <Bar isPlaying={isPlaying} delay={150} minHeight={6} maxHeight={18} />
      <Bar isPlaying={isPlaying} delay={250} minHeight={3} maxHeight={14} />
      <Bar isPlaying={isPlaying} delay={100} minHeight={5} maxHeight={17} />
    </View>
  );
}
