import * as RNFS from '@dr.pogodin/react-native-fs';
import { getAudioMetadata } from '@missingcore/audio-metadata';
import Sound from 'react-native-sound';
import { MUSIC_FOLDER_PATH } from '../constants/paths';
import { Song } from '../types/song';

const formatDuration = (seconds?: number): string | undefined => {
  if (seconds == null) {
    return undefined;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const createFolderIfNotExist = async (): Promise<void> => {
  const folderExists = await RNFS.exists(MUSIC_FOLDER_PATH);

  if (!folderExists) {
    await RNFS.mkdir(MUSIC_FOLDER_PATH);
  }
};

const getAudioDuration = (filePath: string): Promise<number | undefined> => {
  return new Promise(resolve => {
    const sound = new Sound(filePath, '', error => {
      if (error) {
        resolve(undefined);
        return;
      }

      const duration = sound.getDuration();
      sound.release();

      if (!Number.isFinite(duration) || duration <= 0) {
        resolve(undefined);
        return;
      }

      resolve(duration);
    });
  });
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

        const durationSeconds = await getAudioDuration(file.path);

        return {
          name: metadata.name ?? file.name.replace(/\.mp3$/i, ''),
          path: file.path,
          artist: metadata.artist ?? 'Bilinmeyen Sanatçı',
          artwork: metadata.artwork ?? undefined,
          duration: formatDuration(durationSeconds),
        };
      } catch (error) {
        console.error('Metadata Error:', error);

        return {
          name: file.name.replace(/\.mp3$/i, ''),
          path: file.path,
          artist: 'Bilinmeyen Sanatçı',
          artwork: undefined,
          duration: undefined,
        };
      }
    }),
  );

  return songs;
};

export const getMusicFolderPath = (): string => {
  return MUSIC_FOLDER_PATH;
};
