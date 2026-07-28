// screens/PlayerScreen.tsx
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Song } from '../types/song';

const { width } = Dimensions.get('window');

type Props = { song?: Song | null };

const PlayerScreen = ({ song }: Props) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0.6);
  const [volume, setVolume] = useState(0.25);
  const [liked, setLiked] = useState(false);

  return (
    <View className="flex-col bg-black">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-12 pb-4">
        <TouchableOpacity>
          <Ionicons name="chevron-down" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold">Şimdi Çalıyor</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Album Art */}
      <View className="items-center mt-8 mb-10">
        <Image
          source={{ uri: song?.artwork || '' }}
          style={{ width: width - 80, height: width - 80 }}
          className="rounded-2xl"
          resizeMode="cover"
        />
      </View>

      {/* Track Info */}
      <View className="px-6">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-3">
            <Text className="text-white text-2xl font-bold" numberOfLines={1}>
              {song?.name ?? 'All Of Me'}
            </Text>
            <Text className="text-white/60 text-lg mt-0.5" numberOfLines={1}>
              {song?.artist ?? 'Nao'}
            </Text>
          </View>

          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => setLiked(!liked)}
              className="w-10 h-10 rounded-full bg-white/15 items-center justify-center mr-3"
            >
              <Ionicons
                name={liked ? 'star' : 'star-outline'}
                size={18}
                color="#fff"
              />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 rounded-full bg-white/15 items-center justify-center">
              <Ionicons name="ellipsis-horizontal" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress */}
        <View className="mt-8">
          <Slider
            value={progress}
            onValueChange={setProgress}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="#ffffff"
            maximumTrackTintColor="rgba(255,255,255,0.25)"
            thumbTintColor="#ffffff"
          />
          <View className="flex-row items-center justify-between -mt-1">
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

        {/* Controls */}
        <View className="flex-row items-center justify-center mt-10">
          <TouchableOpacity className="mx-8">
            <Ionicons name="play-back" size={38} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsPlaying(!isPlaying)}>
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={64}
              color="#fff"
            />
          </TouchableOpacity>
          <TouchableOpacity className="mx-8">
            <Ionicons name="play-forward" size={38} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PlayerScreen;
