import { getAudioMetadata } from '@missingcore/audio-metadata';
import Sound from 'react-native-sound';
import {
  IDurationCalculator,
  IMetadataExtractor,
  RawSongMetadata,
} from '../interfaces/IMetadataExtractor';

/**
 * Single Responsibility: Extract audio metadata (artist, title, cover art) and audio duration.
 * Implements IMetadataExtractor & IDurationCalculator (DIP / OCP).
 */
export class AudioMetadataService
  implements IMetadataExtractor, IDurationCalculator
{
  async extractMetadata(filePath: string): Promise<RawSongMetadata> {
    try {
      const uri = filePath.startsWith('file://')
        ? filePath
        : `file://${filePath}`;

      const { metadata } = await getAudioMetadata(uri, [
        'artist',
        'artwork',
        'name',
      ] as const);

      return {
        name: metadata.name,
        artist: metadata.artist,
        artwork: metadata.artwork ?? undefined,
      };
    } catch (error) {
      console.warn(`[AudioMetadataService] Failed to extract metadata for ${filePath}:`, error);
      return {};
    }
  }

  calculateDurationSeconds(filePath: string): Promise<number | undefined> {
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
  }
}

export const audioMetadataService = new AudioMetadataService();
