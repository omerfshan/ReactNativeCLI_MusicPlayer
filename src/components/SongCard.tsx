import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { usePlayerContext } from '../context/PlayerContext';
import { useTheme } from '../context/ThemeContext';
import { Song } from '../types/song';

type SongCardProps = {
  song: Song;
};

export default function SongCard({ song }: SongCardProps) {
  const { OpenPlayer } = usePlayerContext();
  const { isDarkMode, colors } = useTheme();

  const placeholderColors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-orange-500',
    'bg-cyan-500',
  ];

  const bgColor =
    placeholderColors[(song.name?.charCodeAt(0) ?? 0) % placeholderColors.length];

  return (
    <Pressable
      onPress={() => OpenPlayer(song)}
      className="flex-row items-center rounded-3xl px-4 py-3 active:opacity-80 border shadow-sm"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.cardBorder,
        shadowColor: isDarkMode ? '#000000' : '#64748b',
        shadowOpacity: isDarkMode ? 0.3 : 0.08,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      {/* Album Cover */}
      {song.artwork ? (
        <Image
          source={{ uri: song.artwork }}
          className="h-16 w-16 rounded-2xl"
          resizeMode="cover"
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
        <Text
          numberOfLines={1}
          className="text-base font-bold"
          style={{ color: colors.textPrimary }}
        >
          {song.name}
        </Text>

        <Text
          numberOfLines={1}
          className="mt-1 text-sm font-medium"
          style={{ color: colors.textSecondary }}
        >
          {song.artist || 'Bilinmeyen Sanatçı'}
        </Text>

        <View className="mt-2 flex-row items-center">
          <Ionicons name="time-outline" size={13} color={colors.textMuted} />
          <Text className="ml-1 text-xs" style={{ color: colors.textMuted }}>
            {song.duration || '--:--'}
          </Text>
        </View>
      </View>

      {/* More */}
      <View className="ml-3">
        <Ionicons name="ellipsis-vertical" size={20} color={colors.textMuted} />
      </View>
    </Pressable>
  );
}
