import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { usePlayerContext } from '../context/PlayerContext';
import { useTheme } from '../context/ThemeContext';
import EqualizerAnimation from './EqualizerAnimation';

export default function MiniPlayer() {
  const {
    currentSong,
    playbackStatus,
    isMiniPlayerVisible,
    isModalOpen,
    openFullPlayer,
    togglePlayPause,
    closeAndStopPlayer,
  } = usePlayerContext();

  const { isDarkMode, colors } = useTheme();

  if (!isMiniPlayerVisible || !currentSong || isModalOpen) {
    return null;
  }

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
    placeholderColors[(currentSong.name?.charCodeAt(0) ?? 0) % placeholderColors.length];

  return (
    <Pressable
      onPress={openFullPlayer}
      className="absolute bottom-4 left-4 right-4 h-16 border rounded-2xl flex-row items-center px-3 shadow-2xl z-50"
      style={{
        backgroundColor: isDarkMode ? '#18181be6' : '#ffffffe6',
        borderColor: colors.cardBorder,
        shadowColor: isDarkMode ? '#000000' : '#64748b',
        shadowOpacity: isDarkMode ? 0.4 : 0.15,
        shadowRadius: 12,
        elevation: 8,
      }}
    >
      {/* Artwork with Equalizer Overlay */}
      <View className="relative h-11 w-11">
        {currentSong.artwork ? (
          <Image
            source={{ uri: currentSong.artwork }}
            className="h-11 w-11 rounded-xl"
            resizeMode="cover"
          />
        ) : (
          <View
            className={`h-11 w-11 rounded-xl items-center justify-center ${bgColor}`}
          >
            <Ionicons name="musical-notes" size={20} color="white" />
          </View>
        )}

        {/* Animated Equalizer Overlay when playing */}
        <View className="absolute inset-0 items-center justify-center bg-black/30 rounded-xl">
          <EqualizerAnimation isPlaying={playbackStatus.isPlaying} />
        </View>
      </View>

      {/* Title & Artist */}
      <View className="flex-1 ml-3 mr-2">
        <Text
          numberOfLines={1}
          className="font-bold text-sm"
          style={{ color: colors.textPrimary }}
        >
          {currentSong.name}
        </Text>
        <Text
          numberOfLines={1}
          className="text-xs mt-0.5 font-medium"
          style={{ color: colors.textSecondary }}
        >
          {currentSong.artist || 'Bilinmeyen Sanatçı'}
        </Text>
      </View>

      {/* Play / Pause Button */}
      <Pressable
        onPress={e => {
          e.stopPropagation();
          togglePlayPause();
        }}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        className="h-10 w-10 items-center justify-center"
      >
        <Ionicons
          name={playbackStatus.isPlaying ? 'pause' : 'play'}
          size={24}
          color={colors.iconColor}
        />
      </Pressable>

      {/* X Close Button */}
      <Pressable
        onPress={e => {
          e.stopPropagation();
          closeAndStopPlayer();
        }}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        className="h-10 w-10 items-center justify-center ml-1"
      >
        <Ionicons name="close" size={24} color="#ef4444" />
      </Pressable>
    </Pressable>
  );
}
