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
        <ActivityIndicator />
        <Text className="mt-3 text-base text-white">Yukleniyor...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black px-4 pt-12">
      <Text className="mb-2 text-2xl font-semibold text-white">Music Player</Text>

      <Text className="mb-4 text-xs text-zinc-400">{musicFolderPath}</Text>

      <Pressable
        className="mb-4 items-center rounded-xl bg-emerald-500 px-4 py-3"
        onPress={loadSongs}>
        <Text className="text-sm font-semibold text-black">Yenile</Text>
      </Pressable>

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
