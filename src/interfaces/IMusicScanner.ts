import { Song } from '../types/song';

export interface IMusicScanner {
  scanMusicFolder(): Promise<Song[]>;
}
