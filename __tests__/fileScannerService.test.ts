import * as RNFS from '@dr.pogodin/react-native-fs';
import { FileScannerService } from '../src/services/fileScannerService';
import { IMetadataExtractor, IDurationCalculator } from '../src/interfaces/IMetadataExtractor';

jest.mock('@dr.pogodin/react-native-fs', () => ({
  exists: jest.fn(),
  mkdir: jest.fn(),
  readDir: jest.fn(),
}), { virtual: true });

jest.mock('@missingcore/audio-metadata', () => ({
  getAudioMetadata: jest.fn(),
}), { virtual: true });

jest.mock('react-native-sound', () => {
  return jest.fn();
}, { virtual: true });

describe('FileScannerService', () => {
  let mockMetadataExtractor: jest.Mocked<IMetadataExtractor>;
  let mockDurationCalculator: jest.Mocked<IDurationCalculator>;
  let scannerService: FileScannerService;

  beforeEach(() => {
    mockMetadataExtractor = {
      extractMetadata: jest.fn(),
    };
    mockDurationCalculator = {
      calculateDurationSeconds: jest.fn(),
    };

    scannerService = new FileScannerService(
      mockMetadataExtractor,
      mockDurationCalculator,
      '/dummy/music/path',
    );
  });

  it('scans music folder and maps mp3 files into Song objects', async () => {
    (RNFS.exists as jest.Mock).mockResolvedValue(true);
    (RNFS.readDir as jest.Mock).mockResolvedValue([
      {
        name: 'test-song.mp3',
        path: '/dummy/music/path/test-song.mp3',
        isFile: () => true,
      },
      {
        name: 'readme.txt',
        path: '/dummy/music/path/readme.txt',
        isFile: () => true,
      },
    ]);

    mockMetadataExtractor.extractMetadata.mockResolvedValue({
      name: 'Test Song',
      artist: 'Test Artist',
      artwork: 'file://artwork.jpg',
    });
    mockDurationCalculator.calculateDurationSeconds.mockResolvedValue(180);

    const songs = await scannerService.scanMusicFolder();

    expect(songs).toHaveLength(1);
    expect(songs[0]).toEqual({
      name: 'Test Song',
      artist: 'Test Artist',
      path: '/dummy/music/path/test-song.mp3',
      artwork: 'file://artwork.jpg',
      duration: '3:00',
      durationSeconds: 180,
    });
  });
});
