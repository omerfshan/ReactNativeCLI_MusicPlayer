import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { usePlayerContext } from '../context/PlayerModalProvider';
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

  if (!isMiniPlayerVisible || !currentSong || isModalOpen) {
    return null;
  }

  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-orange-500',
    'bg-cyan-500',
  ];
  const bgColor = colors[(currentSong.name?.charCodeAt(0) ?? 0) % colors.length];

  return (
    <Pressable
      onPress={openFullPlayer}
      className="absolute bottom-4 left-4 right-4 h-16 bg-zinc-900/95 border border-zinc-800 rounded-2xl flex-row items-center px-3 shadow-2xl z-50"
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
        <Text numberOfLines={1} className="text-white font-bold text-sm">
          {currentSong.name}
        </Text>
        <Text numberOfLines={1} className="text-zinc-400 text-xs mt-0.5">
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
          color="#ffffff"
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
