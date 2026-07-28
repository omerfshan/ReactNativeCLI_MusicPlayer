import React from 'react';
import { Image, Text, View } from 'react-native';

import { Song } from '../types/song';

type SongCardProps = {
  song: Song;
};

export default function SongCard({ song }: SongCardProps) {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-amber-500',
  ];
  const bgColor = colors[(song.name?.charCodeAt(0) || 0) % colors.length];

  return (
    <View className="flex-row items-center bg-zinc-900 rounded-2xl p-3 mb-3">
      {/* flex-row yatay hiza flex-col dikey hiza bg-zinc-900 arkaplan rengi rounded yuvarla  */}
      {song.artwork ? (
        <Image
          source={{ uri: song.artwork }}
          className="h-14 w-14 rounded-lg"
        />
      ) : (
        <View
          className={`h-14 w-14 rounded-lg items-center justify-center ${bgColor}`}
        >
          <Text className="text-xl font-bold text-white">
            {song.name?.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      <View className="flex-1 ml-3">
        <Text className="text-base font-semibold text-white" numberOfLines={1}>
          {song.name}
        </Text>

        <View className="flex-row justify-between items-center mt-1">
          <Text className="text-sm text-zinc-400" numberOfLines={1}>
            {song.artist ?? 'Bilinmeyen Sanatçı'}
          </Text>

          <Text className="text-xs text-zinc-500">
            {song.duration ?? '--:--'}
          </Text>
        </View>
      </View>
    </View>
  );
}
