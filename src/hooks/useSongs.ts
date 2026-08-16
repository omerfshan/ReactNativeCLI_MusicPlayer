import { useCallback, useEffect, useState } from 'react';
import { IMusicScanner } from '../interfaces/IMusicScanner';
import { fileScannerService } from '../services/fileScannerService';
import { Song } from '../types/song';

/**
 * Single Responsibility: Custom hook to manage song fetching state & logic.
 * Decouples state logic from presentation components (SRP/DIP).
 */
export const useSongs = (scanner: IMusicScanner = fileScannerService) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSongs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedSongs = await scanner.scanMusicFolder();
      setSongs(fetchedSongs);
    } catch (e) {
      console.error('[useSongs] Failed to load songs:', e);
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [scanner]);

  useEffect(() => {
    loadSongs();
  }, [loadSongs]);

  return { songs, loading, error, refresh: loadSongs };
};
