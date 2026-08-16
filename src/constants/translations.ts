export type SupportedLanguage = 'tr' | 'en' | 'es' | 'de' | 'fr' | 'ar';

export interface TranslationStrings {
  appTitle: string;
  phoneMusicSubtitle: string;
  totalSongs: string;
  allSongs: string;
  scanningMusic: string;
  noSongsFound: string;
  error: string;
  unknownArtist: string;
  noSongSelected: string;
  nowPlaying: string;
  modeSequential: string;
  modeShuffle: string;
  modeRepeat: string;
  queueButton: string;
  queueTitle: string;
  noMoreSongs: string;
}

export const translations: Record<SupportedLanguage, TranslationStrings> = {
  tr: {
    appTitle: 'Music Player',
    phoneMusicSubtitle: 'Telefonundaki müzikler',
    totalSongs: 'Toplam Şarkı',
    allSongs: 'Tüm Şarkılar',
    scanningMusic: 'Müzikler taranıyor...',
    noSongsFound: 'Şarkı bulunamadı',
    error: 'Hata',
    unknownArtist: 'Bilinmeyen Sanatçı',
    noSongSelected: 'Şarkı Seçilmedi',
    nowPlaying: 'Şimdi Çalıyor',
    modeSequential: 'Sırayla Çal',
    modeShuffle: 'Karıştır',
    modeRepeat: 'Tekrar Çal',
    queueButton: 'Sıradaki Müzikler',
    queueTitle: 'Sıradaki Müzikler',
    noMoreSongs: 'Sırada başka şarkı yok',
  },
  en: {
    appTitle: 'Music Player',
    phoneMusicSubtitle: 'Music on your device',
    totalSongs: 'Total Songs',
    allSongs: 'All Songs',
    scanningMusic: 'Scanning music files...',
    noSongsFound: 'No songs found',
    error: 'Error',
    unknownArtist: 'Unknown Artist',
    noSongSelected: 'No Song Selected',
    nowPlaying: 'Now Playing',
    modeSequential: 'Sequential',
    modeShuffle: 'Shuffle',
    modeRepeat: 'Repeat',
    queueButton: 'Up Next',
    queueTitle: 'Up Next',
    noMoreSongs: 'No more songs in queue',
  },
  es: {
    appTitle: 'Music Player',
    phoneMusicSubtitle: 'Música en tu dispositivo',
    totalSongs: 'Canciones Totales',
    allSongs: 'Todas las Canciones',
    scanningMusic: 'Buscando archivos de música...',
    noSongsFound: 'No se encontraron canciones',
    error: 'Error',
    unknownArtist: 'Artista Desconocido',
    noSongSelected: 'Ninguna Canción Seleccionada',
    nowPlaying: 'Reproduciendo Ahora',
    modeSequential: 'Secuencial',
    modeShuffle: 'Aleatorio',
    modeRepeat: 'Repetir',
    queueButton: 'A Continuación',
    queueTitle: 'A Continuación',
    noMoreSongs: 'No hay más canciones en la cola',
  },
  de: {
    appTitle: 'Music Player',
    phoneMusicSubtitle: 'Musik auf deinem Gerät',
    totalSongs: 'Gesamte Titel',
    allSongs: 'Alle Titel',
    scanningMusic: 'Musikdateien werden gescannt...',
    noSongsFound: 'Keine Titel gefunden',
    error: 'Fehler',
    unknownArtist: 'Unbekannter Künstler',
    noSongSelected: 'Kein Titel Ausgewählt',
    nowPlaying: 'Aktuelle Wiedergabe',
    modeSequential: 'Fortlaufend',
    modeShuffle: 'Zufällig',
    modeRepeat: 'Wiederholen',
    queueButton: 'Wiedergabeliste',
    queueTitle: 'Wiedergabeliste',
    noMoreSongs: 'Keine weiteren Titel in der Liste',
  },
  fr: {
    appTitle: 'Music Player',
    phoneMusicSubtitle: 'Musique sur votre appareil',
    totalSongs: 'Total des Morceaux',
    allSongs: 'Tous les Morceaux',
    scanningMusic: 'Recherche des fichiers musicaux...',
    noSongsFound: 'Aucun morceau trouvé',
    error: 'Erreur',
    unknownArtist: 'Artiste Inconnu',
    noSongSelected: 'Aucun Morceau Sélectionné',
    nowPlaying: 'En Lecture',
    modeSequential: 'Séquentiel',
    modeShuffle: 'Aléatoire',
    modeRepeat: 'Répéter',
    queueButton: 'File d\'attente',
    queueTitle: 'File d\'attente',
    noMoreSongs: 'Plus de morceaux dans la file',
  },
  ar: {
    appTitle: 'Music Player',
    phoneMusicSubtitle: 'الموسيقى على جهازك',
    totalSongs: 'إجمالي الأغاني',
    allSongs: 'جميع الأغاني',
    scanningMusic: 'جارٍ فحص ملفات الموسيقى...',
    noSongsFound: 'لم يتم العثور على أغانٍ',
    error: 'خطأ',
    unknownArtist: 'فنان غير معروف',
    noSongSelected: 'لم يتم تحديد أغنية',
    nowPlaying: 'قيد التشغيل الآن',
    modeSequential: 'تشغيل متتالي',
    modeShuffle: 'تشغيل عشوائي',
    modeRepeat: 'تكرار',
    queueButton: 'التالي في قائمة التشغيل',
    queueTitle: 'قائمة التشغيل',
    noMoreSongs: 'لا توجد أغانٍ أخرى في القائمة',
  },
};
