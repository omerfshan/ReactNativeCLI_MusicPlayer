import React from 'react';
import { FlatList, Modal, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { usePlayerContext } from '../context/PlayerContext';
import { useTheme } from '../context/ThemeContext';
import SongCard from './SongCard';

export default function QueueModal() {
  const { isQueueOpen, setIsQueueOpen, songsQueue, currentSong } =
    usePlayerContext();
  const { isDarkMode, colors } = useTheme();

  if (!isQueueOpen) {
    return null;
  }

  return (
    <Modal
      visible={isQueueOpen}
      animationType="slide"
      transparent
      onRequestClose={() => setIsQueueOpen(false)}
    >
      <View className="flex-1 bg-black/60 justify-end">
        <SafeAreaView
          className="h-4/5 rounded-t-3xl border-t px-5 pt-4 pb-6 shadow-2xl"
          style={{
            backgroundColor: isDarkMode ? '#09090b' : '#f8fafc',
            borderColor: colors.cardBorder,
          }}
        >
          {/* Header */}
          <View
            className="flex-row items-center justify-between pb-4 border-b mb-3"
            style={{
              borderColor: colors.cardBorder,
            }}
          >
            <View className="flex-row items-center">
              <Ionicons name="list" size={24} color={colors.accent} />
              <Text
                className="text-xl font-bold ml-2"
                style={{ color: colors.textPrimary }}
              >
                Sıradaki Müzikler
              </Text>
            </View>

            <Pressable
              onPress={() => setIsQueueOpen(false)}
              className="h-10 w-10 rounded-full items-center justify-center border shadow-sm"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.cardBorder,
              }}
            >
              <Ionicons name="close" size={22} color={colors.iconColor} />
            </Pressable>
          </View>

          {/* Song List */}
          <FlatList
            data={songsQueue}
            keyExtractor={(item, index) => `${item.path}-${index}`}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            renderItem={({ item }) => {
              const isPlayingThis = currentSong?.path === item.path;
              return (
                <View
                  className="rounded-3xl"
                  style={
                    isPlayingThis
                      ? {
                          borderWidth: 1.5,
                          borderColor: colors.accent,
                          backgroundColor: isDarkMode
                            ? 'rgba(34, 197, 94, 0.1)'
                            : 'rgba(16, 185, 129, 0.1)',
                          borderRadius: 24,
                        }
                      : undefined
                  }
                >
                  <SongCard song={item} />
                </View>
              );
            }}
            ListEmptyComponent={
              <View className="items-center py-10">
                <Text
                  className="text-base font-medium"
                  style={{ color: colors.textSecondary }}
                >
                  Sırada başka şarkı yok
                </Text>
              </View>
            }
          />
        </SafeAreaView>
      </View>
    </Modal>
  );
}
