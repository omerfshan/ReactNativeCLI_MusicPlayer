import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';

import {
  getMp3FilesFromMusicFolder,
  getMusicFolderPath,
} from '../services/fileSystemService';

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
      <View>
        <ActivityIndicator />
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>Music Player</Text>

      <Text>{musicFolderPath}</Text>

      <Button title="Yenile" onPress={loadSongs} />

      {songs.length === 0 ? (
        <Text>MP3 bulunamadı.</Text>
      ) : (
        <FlatList
          data={songs}
          keyExtractor={item => item.path}
          renderItem={({ item }) => (
            <View>
              <Text>{item.name}</Text>
              <Text>{item.path}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
