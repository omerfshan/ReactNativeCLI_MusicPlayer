import React, { useEffect, useState } from 'react';
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
import { useProgress } from 'react-native-track-player';
import Ionicons from 'react-native-vector-icons/Ionicons';
import YtProgressBar from '../components/YtProgressBar';
import { usePlayerContext } from '../context/PlayerContext';
import { useTheme } from '../context/ThemeContext';
import { formatTimeSeconds, parseDurationToSeconds } from '../utils/timeFormatter';

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

  const { isDarkMode, colors } = useTheme();
  const [liked, setLiked] = useState(false);
  const [scrubbingSeconds, setScrubbingSeconds] = useState<number | null>(null);

  const { position, duration } = useProgress(250);

  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const artSize = Math.min(width * 0.78, height * 0.35, 340);

  const topPadding = Math.max(
    insets.top,
    Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 44,
  );
  const bottomPadding = Math.max(insets.bottom, 16);

  // Clear any active scrubbing state whenever the song changes
  useEffect(() => {
    setScrubbingSeconds(null);
  }, [currentSong?.path]);

  // Exact song duration determined strictly by the active track
  const songLength =
    currentSong?.durationSeconds && currentSong.durationSeconds > 0
      ? currentSong.durationSeconds
      : parseDurationToSeconds(currentSong?.duration);

  const activeDuration =
    songLength > 0
      ? songLength
      : duration > 0
      ? duration
      : playbackStatus.durationSeconds > 0
      ? playbackStatus.durationSeconds
      : 1;

  const currentSeconds =
    scrubbingSeconds !== null
      ? scrubbingSeconds
      : playbackStatus.currentPositionSeconds > 0
      ? playbackStatus.currentPositionSeconds
      : position;

  const remainingSeconds = Math.max(0, activeDuration - currentSeconds);

  const getModeIconAndLabel = () => {
    switch (playbackMode) {
      case 'shuffle':
        return { icon: 'shuffle', label: 'Karıştır', color: '#22c55e' };
      case 'repeat':
        return { icon: 'repeat', label: 'Tekrar Çal', color: '#3b82f6' };
      case 'sequential':
      default:
        return { icon: 'reorder-two', label: 'Sırayla Çal', color: colors.textSecondary };
    }
  };

  const modeInfo = getModeIconAndLabel();

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <StatusBar barStyle={colors.statusBar} />

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
          <Ionicons name="chevron-down" size={28} color={colors.iconColor} />
        </TouchableOpacity>

        <Text
          className="text-base font-semibold"
          style={{ color: colors.textPrimary }}
        >
          Şimdi Çalıyor
        </Text>

        <TouchableOpacity
          onPress={() => setIsQueueOpen(true)}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          className="p-1"
        >
          <Ionicons name="list" size={24} color={colors.iconColor} />
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
              <Text
                className="text-2xl font-bold"
                numberOfLines={1}
                style={{ color: colors.textPrimary }}
              >
                {currentSong?.name ?? 'Şarkı Seçilmedi'}
              </Text>

              <Text
                className="text-lg mt-1 font-medium"
                numberOfLines={1}
                style={{ color: colors.textSecondary }}
              >
                {currentSong?.artist ?? 'Bilinmeyen Sanatçı'}
              </Text>
            </View>

            <View className="flex-row">
              <TouchableOpacity
                className="w-11 h-11 rounded-full items-center justify-center mr-3 border shadow-sm"
                style={{
                  backgroundColor: colors.controlBg,
                  borderColor: colors.cardBorder,
                }}
                onPress={() => setLiked(!liked)}
              >
                <Ionicons
                  name={liked ? 'star' : 'star-outline'}
                  size={20}
                  color={liked ? '#fbbf24' : colors.iconColor}
                />
              </TouchableOpacity>

              <TouchableOpacity
                className="w-11 h-11 rounded-full items-center justify-center border shadow-sm"
                style={{
                  backgroundColor: colors.controlBg,
                  borderColor: colors.cardBorder,
                }}
                onPress={() => setIsQueueOpen(true)}
              >
                <Ionicons
                  name="ellipsis-horizontal"
                  size={20}
                  color={colors.iconColor}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* YOUTUBE MUSIC CUSTOM PROGRESS BAR & TIMERS */}
          <View className="mt-4">
            <YtProgressBar
              key={currentSong?.path || 'default-track'}
              currentSeconds={currentSeconds}
              durationSeconds={activeDuration}
              trackColor={colors.progressTrack}
              fillColor={colors.progressFill}
              onSlidingChange={seconds => {
                setScrubbingSeconds(seconds);
              }}
              onSeek={seconds => {
                setScrubbingSeconds(seconds);
                seekTo(seconds);
                setTimeout(() => {
                  setScrubbingSeconds(null);
                }, 400);
              }}
            />

            <View className="flex-row justify-between items-center -mt-1">
              <Text className="text-xs font-semibold" style={{ color: colors.textSecondary }}>
                {formatTimeSeconds(currentSeconds)}
              </Text>

              <View className="flex-row items-center">
                <Ionicons
                  name="musical-notes"
                  size={12}
                  color={colors.textSecondary}
                />
                <Text
                  className="text-xs ml-1 font-medium"
                  style={{ color: colors.textSecondary }}
                >
                  Dolby Atmos
                </Text>
              </View>

              <Text className="text-xs font-semibold" style={{ color: colors.textSecondary }}>
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
              <Ionicons
                name="refresh-circle-outline"
                size={32}
                color={colors.textSecondary}
              />
              <Text
                className="text-[10px] font-bold mt-0.5"
                style={{ color: colors.textSecondary }}
              >
                -10sn
              </Text>
            </TouchableOpacity>

            {/* << Previous Track */}
            <TouchableOpacity onPress={playPreviousSong} className="p-2">
              <Ionicons name="play-back" size={38} color={colors.iconColor} />
            </TouchableOpacity>

            {/* Play / Pause */}
            <TouchableOpacity onPress={togglePlayPause}>
              <Ionicons
                name={playbackStatus.isPlaying ? 'pause' : 'play'}
                size={64}
                color={colors.iconColor}
              />
            </TouchableOpacity>

            {/* >> Next Track */}
            <TouchableOpacity onPress={playNextSong} className="p-2">
              <Ionicons name="play-forward" size={38} color={colors.iconColor} />
            </TouchableOpacity>

            {/* +10 sec */}
            <TouchableOpacity
              onPress={seekForward10}
              className="items-center justify-center p-2"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name="refresh-circle"
                size={32}
                color={colors.textSecondary}
              />
              <Text
                className="text-[10px] font-bold mt-0.5"
                style={{ color: colors.textSecondary }}
              >
                +10sn
              </Text>
            </TouchableOpacity>
          </View>

          {/* EXTRA CONTROLS: PLAYBACK MODE & QUEUE BUTTON */}
          <View
            className="flex-row justify-between items-center rounded-2xl p-3 mb-2 border shadow-sm"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.cardBorder,
              shadowColor: isDarkMode ? '#000000' : '#64748b',
              shadowOpacity: isDarkMode ? 0.3 : 0.08,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            {/* Mode Button */}
            <TouchableOpacity
              onPress={togglePlaybackMode}
              className="flex-row items-center px-3 py-2 rounded-xl"
              style={{
                backgroundColor: colors.controlBg,
              }}
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
              className="flex-row items-center px-3 py-2 rounded-xl"
              style={{
                backgroundColor: colors.controlBg,
              }}
            >
              <Ionicons name="list" size={18} color={colors.iconColor} />
              <Text
                className="font-semibold text-xs ml-2"
                style={{ color: colors.textPrimary }}
              >
                Sıradaki Müzikler
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
