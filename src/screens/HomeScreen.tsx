import React from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SongCard from '../components/SongCard';
import { useSongs } from '../hooks/useSongs';

/**
 * Single Responsibility: Present song list UI, headers, and loading/empty states.
 * Delegates song state management to useSongs hook (SRP/DIP).
 */
export default function HomeScreen() {
  const { songs, loading, error, refresh } = useSongs();

  if (error) {
    Alert.alert('Hata', error);
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#22c55e" />
        <Text className="text-zinc-400 mt-4">Müzikler taranıyor...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <FlatList
        data={songs}
        keyExtractor={item => item.path}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListHeaderComponent={
          <View className="px-6 pt-4 pb-8">
            <View className="flex-row justify-between items-start">
              <View>
                <View className="flex-row items-center">
                  <View className="h-14 w-14 rounded-full bg-emerald-500 items-center justify-center">
                    <Ionicons name="musical-notes" size={28} color="black" />
                  </View>

                  <View className="ml-4">
                    <Text className="text-white text-3xl font-bold">
                      Music Player
                    </Text>
                    <Text className="text-zinc-400 mt-1">
                      Telefonundaki müzikler
                    </Text>
                  </View>
                </View>
              </View>

              <Pressable
                onPress={refresh}
                className="h-12 w-12 rounded-full bg-zinc-900 items-center justify-center active:opacity-70"
              >
                <Ionicons name="refresh" size={22} color="#22c55e" />
              </Pressable>
            </View>

            <View className="mt-7 rounded-3xl bg-zinc-900 p-5">
              <Text className="text-zinc-400 text-sm">Toplam Şarkı</Text>
              <Text className="text-white text-4xl font-bold mt-1">
                {songs.length}
              </Text>
            </View>

            <Text className="text-white text-xl font-bold mt-8 mb-4">
              Tüm Şarkılar
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View className="items-center mt-20">
            <Ionicons name="musical-note-outline" size={80} color="#555" />
            <Text className="text-zinc-400 mt-5 text-lg">Şarkı bulunamadı</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="px-6">
            <SongCard song={item} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}
