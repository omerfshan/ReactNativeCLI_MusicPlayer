import Slider from '@react-native-community/slider';
import React, { useState } from 'react';
import {
  Image,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { usePlayerContext } from '../context/PlayerModalProvider';
import { formatTimeSeconds } from '../utils/timeFormatter';

export default function PlayerScreen() {
  const {
    currentSong,
    playbackStatus,
    playbackMode,
    ClosePlayer,
    togglePlayPause,
    playNextSong,
    playPreviousSong,
    seekForward10,
    seekBackward10,
    togglePlaybackMode,
    seekTo,
    setIsQueueOpen,
  } = usePlayerContext();

  const [liked, setLiked] = useState(false);

  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const artSize = Math.min(width * 0.78, height * 0.35, 340);

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44,
  );
  const bottomPadding = Math.max(insets.bottom, 16);

  const currentSeconds = playbackStatus.currentPositionSeconds || 0;
  const durationSeconds = playbackStatus.durationSeconds || 1;
  const remainingSeconds = Math.max(0, durationSeconds - currentSeconds);

  const getModeIconAndLabel = () => {
    switch (playbackMode) {
      case 'shuffle':
        return { icon: 'shuffle', label: 'Karıştır', color: '#22c55e' };
      case 'repeat':
        return { icon: 'repeat', label: 'Tekrar Çal', color: '#3b82f6' };
      case 'sequential':
      default:
        return { icon: 'reorder-two', label: 'Sırayla Çal', color: '#a1a1aa' };
    }
  };

  const modeInfo = getModeIconAndLabel();

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
          onPress={() => setIsQueueOpen(true)}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          className="p-1"
        >
          <Ionicons name="list" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* MAIN CONTENT CONTAINER */}
      <View
        className="flex-1 justify-between px-6"
        style={{ paddingBottom: bottomPadding }}
      >
        {/* ALBUM ARTWORK */}
        <View className="items-center justify-center flex-1 py-2">
          <Image
            source={{
              uri:
                currentSong?.artwork ||
                'https://images.genius.com/dbf5a4c4045b74b075a0f61a38ae7da2.1000x1000x1.png',
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
          {/* SONG INFO */}
          <View className="flex-row items-center justify-between">
            <View className="flex-1 mr-4">
              <Text className="text-white text-2xl font-bold" numberOfLines={1}>
                {currentSong?.name ?? 'Şarkı Seçilmedi'}
              </Text>

              <Text className="text-white/60 text-lg mt-1" numberOfLines={1}>
                {currentSong?.artist ?? 'Bilinmeyen Sanatçı'}
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

              <TouchableOpacity
                className="w-11 h-11 rounded-full bg-white/10 items-center justify-center"
                onPress={() => setIsQueueOpen(true)}
              >
                <Ionicons name="ellipsis-horizontal" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* SLIDER & TIMERS */}
          <View className="mt-6">
            <Slider
              value={currentSeconds}
              minimumValue={0}
              maximumValue={durationSeconds}
              onSlidingComplete={value => seekTo(value)}
              minimumTrackTintColor="#fff"
              maximumTrackTintColor="rgba(255,255,255,0.25)"
              thumbTintColor="#fff"
            />

            <View className="flex-row justify-between items-center mt-1">
              <Text className="text-white/60 text-xs">
                {formatTimeSeconds(currentSeconds)}
              </Text>

              <View className="flex-row items-center">
                <Ionicons
                  name="musical-notes"
                  size={12}
                  color="rgba(255,255,255,0.6)"
                />
                <Text className="text-white/60 text-xs ml-1">Dolby Atmos</Text>
              </View>

              <Text className="text-white/60 text-xs">
                -{formatTimeSeconds(remainingSeconds)}
              </Text>
            </View>
          </View>

          {/* CONTROLS (-10s, Prev <<, Play/Pause, Next >>, +10s) */}
          <View className="flex-row justify-between items-center my-5 px-2">
            {/* -10 sec */}
            <TouchableOpacity
              onPress={seekBackward10}
              className="items-center justify-center p-2"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="refresh-circle-outline" size={32} color="#a1a1aa" />
              <Text className="text-zinc-400 text-[10px] font-bold mt-0.5">-10sn</Text>
            </TouchableOpacity>

            {/* << Previous Track */}
            <TouchableOpacity onPress={playPreviousSong} className="p-2">
              <Ionicons name="play-back" size={38} color="#fff" />
            </TouchableOpacity>

            {/* Play / Pause */}
            <TouchableOpacity onPress={togglePlayPause}>
              <Ionicons
                name={playbackStatus.isPlaying ? 'pause' : 'play'}
                size={64}
                color="#fff"
              />
            </TouchableOpacity>

            {/* >> Next Track */}
            <TouchableOpacity onPress={playNextSong} className="p-2">
              <Ionicons name="play-forward" size={38} color="#fff" />
            </TouchableOpacity>

            {/* +10 sec */}
            <TouchableOpacity
              onPress={seekForward10}
              className="items-center justify-center p-2"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="refresh-circle" size={32} color="#a1a1aa" />
              <Text className="text-zinc-400 text-[10px] font-bold mt-0.5">+10sn</Text>
            </TouchableOpacity>
          </View>

          {/* EXTRA CONTROLS: PLAYBACK MODE (Sırayla / Karıştır / Tekrar) & QUEUE BUTTON */}
          <View className="flex-row justify-between items-center bg-zinc-900/90 rounded-2xl p-3 mb-2 border border-zinc-800">
            {/* Mode Button (Sequential -> Shuffle -> Repeat) */}
            <TouchableOpacity
              onPress={togglePlaybackMode}
              className="flex-row items-center px-3 py-2 rounded-xl bg-zinc-800"
            >
              <Ionicons
                name={modeInfo.icon}
                size={18}
                color={modeInfo.color}
              />
              <Text
                className="font-semibold text-xs ml-2"
                style={{ color: modeInfo.color }}
              >
                {modeInfo.label}
              </Text>
            </TouchableOpacity>

            {/* Up Next / Queue Button */}
            <TouchableOpacity
              onPress={() => setIsQueueOpen(true)}
              className="flex-row items-center px-3 py-2 rounded-xl bg-zinc-800"
            >
              <Ionicons name="list" size={18} color="#ffffff" />
              <Text className="text-white font-medium text-xs ml-2">
                Sıradaki Müzikler
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
