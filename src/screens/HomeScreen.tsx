import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  Pressable,
} from 'react-native';

import {
  getMp3FilesFromMusicFolder,
  getMusicFolderPath,
} from '../services/fileSystemService';

import Ionicons from 'react-native-vector-icons/Ionicons';
import SongCard from '../components/SongCard';
import { Song } from '../types/song';

export default function HomeScreen() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  const musicFolderPath = getMusicFolderPath();

  const loadSongs = async () => {
    try {
      setLoading(true);
      const mp3Files = await getMp3FilesFromMusicFolder();
      setSongs(mp3Files);
    } catch (error) {
      console.log('MP3 OKUMA HATASI:', error);
      Alert.alert('Hata', String(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSongs();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-black px-4">
        <ActivityIndicator size="large" color="#10b981" />
        <Text className="mt-3 text-base text-white">Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black px-4 pt-12">
      <View className="flex-row items-center justify-between mb-1">
        <View className="flex-row items-center">
          <Ionicons name="musical-notes" size={26} color="#10b981" />
          <Text className="ml-2.5 text-2xl font-bold text-white">Music Player</Text>
        </View>
        <Pressable
          className="flex-row items-center rounded-xl bg-emerald-500 px-3.5 py-2 active:opacity-80"
          onPress={loadSongs}>
          <Ionicons name="refresh-outline" size={16} color="#000000" />
          <Text className="ml-1.5 text-sm font-semibold text-black">Yenile</Text>
        </Pressable>
      </View>

      <Text className="mb-4 text-xs text-zinc-400">{musicFolderPath}</Text>

      {songs.length === 0 ? (
        <Text className="text-zinc-300">MP3 bulunamadi.</Text>
      ) : (
        <FlatList
          data={songs}
          keyExtractor={item => item.path}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => <SongCard song={item} />}
        />
      )}
    </View>
  );
}
