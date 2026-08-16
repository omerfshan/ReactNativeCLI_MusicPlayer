export interface RawSongMetadata {
  name?: string;
  artist?: string;
  artwork?: string;
}

export interface IMetadataExtractor {
  extractMetadata(filePath: string): Promise<RawSongMetadata>;
}

export interface IDurationCalculator {
  calculateDurationSeconds(filePath: string): Promise<number | undefined>;
}
