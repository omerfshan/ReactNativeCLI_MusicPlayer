import React from 'react';
import { Image, Text, View, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Song } from '../types/song';
import { usePlayerSheet } from '../context/PlayerSheetContext';

type SongCardProps = { song: Song };

export default function SongCard({ song }: SongCardProps) {
  const { openPlayer } = usePlayerSheet();

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
    <Pressable
      onPress={() => openPlayer(song)}
      className="flex-row items-center bg-zinc-900 rounded-2xl p-3 mb-3 active:opacity-70"
    >
      {song.artwork ? (
        <Image
          source={{ uri: song.artwork }}
          className="h-14 w-14 rounded-lg"
        />
      ) : (
        <View
          className={`h-14 w-14 rounded-lg items-center justify-center ${bgColor}`}
        >
          <Ionicons name="musical-note" size={26} color="#ffffff" />
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
      <Ionicons name="play-circle" size={32} color="#10b981" style={{ marginLeft: 8 }} />
    </Pressable>
  );
}
