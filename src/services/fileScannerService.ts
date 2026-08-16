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

type ScannedFileItem = {
  name: string;
  path: string;
  isFile: () => boolean;
};

/**
 * Single Responsibility: Scan local file system with batching & low memory footprint.
 * Prevents EXC_RESOURCE memory watermark spikes by chunking audio decoders.
 */
export class FileScannerService implements IMusicScanner {
  constructor(
    private readonly metadataExtractor: IMetadataExtractor = audioMetadataService,
    private readonly durationCalculator: IDurationCalculator = audioMetadataService,
    private readonly folderPath: string = MUSIC_FOLDER_PATH,
  ) {}

  private async ensureFolderExists(): Promise<void> {
    try {
      const folderExists = await RNFS.exists(this.folderPath);
      if (!folderExists) {
        await RNFS.mkdir(this.folderPath);
      }
    } catch (e) {
      console.warn('[FileScannerService] Could not access folder:', e);
    }
  }

  private async parseSingleFile(file: ScannedFileItem): Promise<Song> {
    try {
      const metadata = await this.metadataExtractor.extractMetadata(file.path);
      const durationSeconds =
        await this.durationCalculator.calculateDurationSeconds(file.path);

      return {
        name: metadata.name ?? file.name.replace(/\.mp3$/i, ''),
        path: file.path,
        artist: metadata.artist ?? 'Bilinmeyen Sanatçı',
        artwork: metadata.artwork,
        duration: formatDuration(durationSeconds),
        durationSeconds: durationSeconds,
      };
    } catch (error) {
      return {
        name: file.name.replace(/\.mp3$/i, ''),
        path: file.path,
        artist: 'Bilinmeyen Sanatçı',
        artwork: undefined,
        duration: undefined,
        durationSeconds: undefined,
      };
    }
  }

  async scanMusicFolder(): Promise<Song[]> {
    await this.ensureFolderExists();

    try {
      const files = await RNFS.readDir(this.folderPath);
      const mp3Files = files
        .filter(file => file.isFile())
        .filter(file => file.name.toLowerCase().endsWith('.mp3'));

      if (mp3Files.length === 0) {
        return [];
      }

      const songs: Song[] = [];
      // Process in batches of 4 to prevent memory pressure
      const BATCH_SIZE = 4;
      for (let i = 0; i < mp3Files.length; i += BATCH_SIZE) {
        const batch = mp3Files.slice(i, i + BATCH_SIZE);
        const batchResults = await Promise.all(
          batch.map(file => this.parseSingleFile(file)),
        );
        songs.push(...batchResults);
      }

      return songs;
    } catch (err) {
      console.warn('[FileScannerService] Read directory error:', err);
      return [];
    }
  }
}

export const fileScannerService = new FileScannerService();
