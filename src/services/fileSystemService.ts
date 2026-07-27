import RNFS from 'react-native-fs';
import { MUSIC_FOLDER_PATH } from '../constants/paths';
import { Song } from '../types/song';
import { getAudioMetadata } from '@missingcore/audio-metadata';
export const createFolderIfNotExist = async (): Promise<void> => {
  const folderExists = await RNFS.exists(MUSIC_FOLDER_PATH);

  if (!folderExists) {
    await RNFS.mkdir(MUSIC_FOLDER_PATH);
  }
};

export const getMp3FilesFromMusicFolder = async (): Promise<Song[]> => {
  await createFolderIfNotExist();

  const files = await RNFS.readDir(MUSIC_FOLDER_PATH);

  const mp3Files = files
    .filter(file => file.isFile())
    .filter(file => file.name.toLowerCase().endsWith('.mp3'));

  const songs: Song[] = await Promise.all(
    mp3Files.map(async file => {
      try {
        const uri = `file://${file.path}`;
        const { metadata } = await getAudioMetadata(uri, [
          'artist',
          'artwork',
          'name',
        ] as const);
        return {
          name: metadata.name ?? file.name.replace(/\.mp3$/i, ''),
          path: file.path,
          artist: metadata.artist ?? 'Bilinmeyen Sanatçı',
          artwork: metadata.artwork ?? undefined,
        } as Song;
      } catch {
        return {
          name: file.name.replace(/\.mp3$/i, ''),
          path: file.path,
          artist: 'Bilinmeyen Sanatçı',
          artwork: undefined,
        } as Song;
      }
    }),
  );
  return songs;
};

export const getMusicFolderPath = (): string => {
  return MUSIC_FOLDER_PATH;
};
