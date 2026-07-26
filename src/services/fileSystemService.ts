import RNFS from 'react-native-fs';
import { MUSIC_FOLDER_PATH } from '../constants/paths';
import { Song } from '../types/song';

export const createFolderIfNotExist = async (): Promise<void> => {
  const folderExists = await RNFS.exists(MUSIC_FOLDER_PATH);

  if (!folderExists) {
    await RNFS.mkdir(MUSIC_FOLDER_PATH);
  }
};

export const getMp3FilesFromMusicFolder = async (): Promise<Song[]> => {
  await createFolderIfNotExist();

  const files = await RNFS.readDir(MUSIC_FOLDER_PATH);

  const mp3Files: Song[] = files
    .filter(file => file.isFile())
    .filter(file => file.name.toLowerCase().endsWith('.mp3'))
    .map(file => ({
      name: file.name,
      path: file.path,
      size: file.size,
    }));

  return mp3Files;
};

export const getMusicFolderPath = (): string => {
  return MUSIC_FOLDER_PATH;
};
