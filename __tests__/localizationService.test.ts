import { LocalizationService } from '../src/services/localizationService';

describe('LocalizationService (SOLID SRP/DIP)', () => {
  const service = new LocalizationService();

  it('returns Turkish strings for "tr"', () => {
    const strings = service.getStrings('tr');
    expect(strings.allSongs).toBe('Tüm Şarkılar');
    expect(strings.totalSongs).toBe('Toplam Şarkı');
    expect(strings.nowPlaying).toBe('Şimdi Çalıyor');
  });

  it('returns English strings for "en"', () => {
    const strings = service.getStrings('en');
    expect(strings.allSongs).toBe('All Songs');
    expect(strings.totalSongs).toBe('Total Songs');
    expect(strings.nowPlaying).toBe('Now Playing');
  });

  it('returns Spanish strings for "es"', () => {
    const strings = service.getStrings('es');
    expect(strings.allSongs).toBe('Todas las Canciones');
    expect(strings.nowPlaying).toBe('Reproduciendo Ahora');
  });

  it('returns German strings for "de"', () => {
    const strings = service.getStrings('de');
    expect(strings.allSongs).toBe('Alle Titel');
    expect(strings.nowPlaying).toBe('Aktuelle Wiedergabe');
  });

  it('returns French strings for "fr"', () => {
    const strings = service.getStrings('fr');
    expect(strings.allSongs).toBe('Tous les Morceaux');
    expect(strings.nowPlaying).toBe('En Lecture');
  });

  it('returns Arabic strings for "ar"', () => {
    const strings = service.getStrings('ar');
    expect(strings.allSongs).toBe('جميع الأغاني');
    expect(strings.nowPlaying).toBe('قيد التشغيل الآن');
  });
});
