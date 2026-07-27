import { Platform } from 'react-native';
import * as RNFS from '@dr.pogodin/react-native-fs';

export const MUSIC_FOLDER_NAME = 'MusicFiles';

export const MUSIC_FOLDER_PATH =
  Platform.OS === 'android'
    ? `${RNFS.ExternalStorageDirectoryPath}/${MUSIC_FOLDER_NAME}`
    : `${RNFS.DocumentDirectoryPath}/${MUSIC_FOLDER_NAME}`;
