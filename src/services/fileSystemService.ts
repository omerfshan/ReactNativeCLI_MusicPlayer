import { MUSIC_FOLDER_PATH } from '../constants/paths';
import { Song } from '../types/song';
import { fileScannerService } from './fileScannerService';

/**
 * Legacy wrapper module maintaining backward compatibility for getMp3FilesFromMusicFolder
 * while delegating single-responsibility file scanning to FileScannerService (SRP/DIP).
 */
export const getMp3FilesFromMusicFolder = (): Promise<Song[]> => {
  return fileScannerService.scanMusicFolder();
};

export const getMusicFolderPath = (): string => {
  return MUSIC_FOLDER_PATH;
};
