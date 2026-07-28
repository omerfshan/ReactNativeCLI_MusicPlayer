// screens/PlayerScreen.tsx

import React, { useState } from 'react';
import {
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Song } from '../types/song';
import { usePlayerContext } from '../context/PlayerModalProvider';

type Props = {
  song?: Song | null;
};

export default function PlayerScreen({ song }: Props) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0.6);
  const [liked, setLiked] = useState(false);

  const { ClosePlayer } = usePlayerContext();

  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Dynamically calculate album cover size based on width AND available screen height
  const artSize = Math.min(width * 0.78, height * 0.35, 340);

  // Calculate safe top and bottom padding to avoid notch / status bar / gesture bar overlap
  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44,
  );
  const bottomPadding = Math.max(insets.bottom, 16);

  return (
    <View className="flex-1 bg-black">
      {/* HEADER */}
      <View
        className="flex-row items-center justify-between px-5 pb-2"
        style={{ paddingTop: topPadding + 6 }}
      >
        <TouchableOpacity
          onPress={ClosePlayer}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          className="p-1"
        >
          <Ionicons name="chevron-down" size={28} color="#fff" />
        </TouchableOpacity>

        <Text className="text-white text-base font-semibold">
          Şimdi Çalıyor
        </Text>

        <TouchableOpacity
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          className="p-1"
        >
          <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* MAIN CONTENT CONTAINER */}
      <View
        className="flex-1 justify-between px-6"
        style={{ paddingBottom: bottomPadding }}
      >
        {/* ALBUM */}
        <View className="items-center justify-center flex-1 py-2">
          <Image
            source={{
              uri: song?.artwork || 'https://picsum.photos/500',
            }}
            resizeMode="cover"
            style={{
              width: artSize,
              height: artSize,
              borderRadius: 22,
            }}
          />
        </View>

        {/* BOTTOM SECTION */}
        <View className="w-full">
          {/* ŞARKI BİLGİSİ */}
          <View className="flex-row items-center justify-between">
            <View className="flex-1 mr-4">
              <Text className="text-white text-2xl font-bold" numberOfLines={1}>
                {song?.name ?? 'Blinding Lights'}
              </Text>

              <Text className="text-white/60 text-lg mt-1" numberOfLines={1}>
                {song?.artist ?? 'The Weeknd'}
              </Text>
            </View>

            <View className="flex-row">
              <TouchableOpacity
                className="w-11 h-11 rounded-full bg-white/10 items-center justify-center mr-3"
                onPress={() => setLiked(!liked)}
              >
                <Ionicons
                  name={liked ? 'star' : 'star-outline'}
                  size={20}
                  color="#fff"
                />
              </TouchableOpacity>

              <TouchableOpacity className="w-11 h-11 rounded-full bg-white/10 items-center justify-center">
                <Ionicons name="ellipsis-horizontal" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* SLIDER */}
          <View className="mt-6">
            <Slider
              value={progress}
              onValueChange={setProgress}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="#fff"
              maximumTrackTintColor="rgba(255,255,255,0.25)"
              thumbTintColor="#fff"
            />

            <View className="flex-row justify-between items-center mt-1">
              <Text className="text-white/60 text-xs">1:41</Text>

              <View className="flex-row items-center">
                <Ionicons
                  name="musical-notes"
                  size={12}
                  color="rgba(255,255,255,0.6)"
                />
                <Text className="text-white/60 text-xs ml-1">Dolby Atmos</Text>
              </View>

              <Text className="text-white/60 text-xs">-1:04</Text>
            </View>
          </View>

          {/* KONTROLLER */}
          <View className="flex-row justify-center items-center my-6">
            <TouchableOpacity className="mx-8">
              <Ionicons name="play-back" size={40} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsPlaying(!isPlaying)}>
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={68}
                color="#fff"
              />
            </TouchableOpacity>

            <TouchableOpacity className="mx-8">
              <Ionicons name="play-forward" size={40} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
