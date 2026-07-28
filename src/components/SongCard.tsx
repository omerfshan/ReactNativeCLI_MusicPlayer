import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { usePlayerContext } from '../context/PlayerModalProvider';
import { Song } from '../types/song';

type SongCardProps = {
  song: Song;
};

export default function SongCard({ song }: SongCardProps) {
  const { OpenPlayer } = usePlayerContext();

  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-orange-500',
    'bg-cyan-500',
  ];

  const bgColor = colors[(song.name?.charCodeAt(0) ?? 0) % colors.length];

  return (
    <Pressable
      onPress={() => OpenPlayer(song)}
      className="flex-row items-center rounded-3xl bg-zinc-900 px-4 py-3 active:opacity-80"
    >
      {/* Album Cover */}

      {song.artwork ? (
        <Image
          source={{ uri: song.artwork }}
          className="h-16 w-16 rounded-2xl"
        />
      ) : (
        <View
          className={`h-16 w-16 rounded-2xl items-center justify-center ${bgColor}`}
        >
          <Ionicons name="musical-notes" size={30} color="white" />
        </View>
      )}

      {/* Song Info */}

      <View className="flex-1 ml-4">
        <Text numberOfLines={1} className="text-white text-base font-bold">
          {song.name}
        </Text>

        <Text numberOfLines={1} className="mt-1 text-sm text-zinc-400">
          {song.artist || 'Bilinmeyen Sanatçı'}
        </Text>

        <View className="mt-2 flex-row items-center">
          <Ionicons name="time-outline" size={13} color="#71717a" />

          <Text className="ml-1 text-xs text-zinc-500">
            {song.duration || '--:--'}
          </Text>
        </View>
      </View>

      {/* More */}

      <View className="ml-3">
        <Ionicons name="ellipsis-vertical" size={20} color="#9ca3af" />
      </View>
    </Pressable>
  );
}
