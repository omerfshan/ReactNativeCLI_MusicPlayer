import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MiniPlayer from '../components/MiniPlayer';
import SongCard from '../components/SongCard';
import { useLocalization } from '../context/LocalizationContext';
import { usePlayerContext } from '../context/PlayerContext';
import { useTheme } from '../context/ThemeContext';
import { useSongs } from '../hooks/useSongs';

/**
 * Single Responsibility: Present song list UI, header with refresh action,
 * and floating MiniPlayer. Automatically follows device Dark / Light mode and language.
 */
export default function HomeScreen() {
  const { songs, loading, error, refresh } = useSongs();
  const { setQueue } = usePlayerContext();
  const { isDarkMode, colors } = useTheme();
  const { t } = useLocalization();

  useEffect(() => {
    if (songs && songs.length > 0) {
      setQueue(songs);
    }
  }, [setQueue, songs]);

  if (error) {
    Alert.alert(t.error, error);
  }

  if (loading) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <StatusBar
          barStyle={colors.statusBar}
          backgroundColor={colors.background}
        />
        <ActivityIndicator size="large" color={colors.accent} />
        <Text className="mt-4 font-medium" style={{ color: colors.textSecondary }}>
          {t.scanningMusic}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 relative"
      style={{ backgroundColor: colors.background }}
    >
      <StatusBar
        barStyle={colors.statusBar}
        backgroundColor={colors.background}
      />
      <FlatList
        data={songs}
        keyExtractor={item => item.path}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 90,
        }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListHeaderComponent={
          <View className="px-6 pt-4 pb-8">
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center flex-1">
                <View
                  className="h-14 w-14 rounded-full items-center justify-center shadow-lg"
                  style={{ backgroundColor: colors.accent }}
                >
                  <Ionicons name="musical-notes" size={28} color="white" />
                </View>

                <View className="ml-4 flex-1">
                  <Text
                    className="text-3xl font-bold"
                    style={{ color: colors.textPrimary }}
                  >
                    {t.appTitle}
                  </Text>
                  <Text
                    className="mt-1 font-medium"
                    style={{ color: colors.textSecondary }}
                  >
                    {t.phoneMusicSubtitle}
                  </Text>
                </View>
              </View>

              {/* Refresh Action Button */}
              <Pressable
                onPress={refresh}
                className="h-12 w-12 rounded-full items-center justify-center border active:opacity-60 shadow-sm"
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: colors.cardBorder,
                  shadowColor: isDarkMode ? '#000000' : '#64748b',
                  shadowOpacity: isDarkMode ? 0.3 : 0.08,
                  shadowRadius: 6,
                  elevation: 2,
                }}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Ionicons name="refresh" size={22} color={colors.accent} />
              </Pressable>
            </View>

            {/* Total Songs Card */}
            <View
              className="mt-7 rounded-3xl p-5 border shadow-sm"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.cardBorder,
                shadowColor: isDarkMode ? '#000000' : '#64748b',
                shadowOpacity: isDarkMode ? 0.3 : 0.08,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                {t.totalSongs}
              </Text>
              <Text
                className="text-4xl font-bold mt-1"
                style={{ color: colors.textPrimary }}
              >
                {songs.length}
              </Text>
            </View>

            <Text
              className="text-xl font-bold mt-8 mb-4"
              style={{ color: colors.textPrimary }}
            >
              {t.allSongs}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View className="items-center mt-20">
            <Ionicons
              name="musical-note-outline"
              size={80}
              color={colors.textMuted}
            />
            <Text
              className="mt-5 text-lg font-medium"
              style={{ color: colors.textSecondary }}
            >
              {t.noSongsFound}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="px-6">
            <SongCard song={item} />
          </View>
        )}
      />

      {/* Floating Mini Player at Bottom */}
      <MiniPlayer />
    </SafeAreaView>
  );
}
