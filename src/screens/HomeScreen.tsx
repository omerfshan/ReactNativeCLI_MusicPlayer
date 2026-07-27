import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
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
      <View style={styles.centered}>
        <ActivityIndicator />
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Music Player</Text>

      <Text style={styles.path}>{musicFolderPath}</Text>

      <Button title="Yenile" onPress={loadSongs} />

      {songs.length === 0 ? (
        <Text>MP3 bulunamadı.</Text>
      ) : (
        <FlatList
          data={songs}
          keyExtractor={item => item.path}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {item.artwork ? (
                <Image source={{ uri: item.artwork }} style={styles.artwork} />
              ) : (
                <View style={[styles.artwork, styles.artworkPlaceholder]} />
              )}
              <View style={styles.meta}>
                <Text style={styles.songName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.artist} numberOfLines={1}>
                  {item.artist}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 48,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
  },
  path: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  artwork: {
    width: 56,
    height: 56,
    borderRadius: 6,
  },
  artworkPlaceholder: {
    backgroundColor: '#ddd',
  },
  meta: {
    flex: 1,
  },
  songName: {
    fontSize: 16,
    fontWeight: '500',
  },
  artist: {
    fontSize: 13,
    opacity: 0.7,
    marginTop: 2,
  },
});
