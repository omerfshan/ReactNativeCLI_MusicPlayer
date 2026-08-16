import React from 'react';
import { FlatList, Modal, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { usePlayerContext } from '../context/PlayerModalProvider';
import SongCard from './SongCard';

export default function QueueModal() {
  const { isQueueOpen, setIsQueueOpen, songsQueue, currentSong } =
    usePlayerContext();

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
      <View className="flex-1 bg-black/80 justify-end">
        <SafeAreaView className="h-4/5 bg-zinc-950 rounded-t-3xl border-t border-zinc-800 px-5 pt-4 pb-6">
          {/* Header */}
          <View className="flex-row items-center justify-between pb-4 border-b border-zinc-800 mb-3">
            <View className="flex-row items-center">
              <Ionicons name="list" size={24} color="#22c55e" />
              <Text className="text-white text-xl font-bold ml-2">
                Sıradaki Müzikler
              </Text>
            </View>

            <Pressable
              onPress={() => setIsQueueOpen(false)}
              className="h-10 w-10 bg-zinc-900 rounded-full items-center justify-center"
            >
              <Ionicons name="close" size={22} color="#fff" />
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
                  className={`rounded-3xl ${
                    isPlayingThis ? 'border border-emerald-500/50 bg-emerald-950/20' : ''
                  }`}
                >
                  <SongCard song={item} />
                </View>
              );
            }}
            ListEmptyComponent={
              <View className="items-center py-10">
                <Text className="text-zinc-500 text-base">
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
