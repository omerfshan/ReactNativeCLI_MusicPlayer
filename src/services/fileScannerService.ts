import * as RNFS from '@dr.pogodin/react-native-fs';
import { MUSIC_FOLDER_PATH } from '../constants/paths';
import {
  IDurationCalculator,
  IMetadataExtractor,
} from '../interfaces/IMetadataExtractor';
import { IMusicScanner } from '../interfaces/IMusicScanner';
import { Song } from '../types/song';
import { formatDuration } from '../utils/timeFormatter';
import { audioMetadataService } from './audioMetadataService';

/**
 * Single Responsibility: Scan the local file system for MP3 music files.
 * Implements IMusicScanner interface and injects metadata/duration services (DIP/SRP).
 */
export class FileScannerService implements IMusicScanner {
  constructor(
    private readonly metadataExtractor: IMetadataExtractor = audioMetadataService,
    private readonly durationCalculator: IDurationCalculator = audioMetadataService,
    private readonly folderPath: string = MUSIC_FOLDER_PATH,
  ) {}

  private async ensureFolderExists(): Promise<void> {
    const folderExists = await RNFS.exists(this.folderPath);
    if (!folderExists) {
      await RNFS.mkdir(this.folderPath);
    }
  }

  async scanMusicFolder(): Promise<Song[]> {
    await this.ensureFolderExists();

    const files = await RNFS.readDir(this.folderPath);
    const mp3Files = files
      .filter(file => file.isFile())
      .filter(file => file.name.toLowerCase().endsWith('.mp3'));

    const songs: Song[] = await Promise.all(
      mp3Files.map(async file => {
        try {
          const metadata = await this.metadataExtractor.extractMetadata(
            file.path,
          );
          const durationSeconds =
            await this.durationCalculator.calculateDurationSeconds(file.path);

          return {
            name: metadata.name ?? file.name.replace(/\.mp3$/i, ''),
            path: file.path,
            artist: metadata.artist ?? 'Bilinmeyen Sanatçı',
            artwork: metadata.artwork,
            duration: formatDuration(durationSeconds),
          };
        } catch (error) {
          console.error(`[FileScannerService] Error parsing ${file.name}:`, error);

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
  }
}

export const fileScannerService = new FileScannerService();
