import { NativeModules, Platform } from 'react-native';
import {
  SupportedLanguage,
  translations,
  TranslationStrings,
} from '../constants/translations';

export interface ILocalizationService {
  getDeviceLanguage(): SupportedLanguage;
  getStrings(lang?: SupportedLanguage): TranslationStrings;
}

/**
 * Single Responsibility: Detect device language and retrieve matching localized strings.
 */
export class LocalizationService implements ILocalizationService {
  getDeviceLanguage(): SupportedLanguage {
    try {
      let rawLocale = 'en';

      if (Platform.OS === 'ios') {
        rawLocale =
          NativeModules.SettingsManager?.settings?.AppleLocale ||
          NativeModules.SettingsManager?.settings?.AppleLanguages?.[0] ||
          'en';
      } else {
        rawLocale = NativeModules.I18nManager?.localeIdentifier || 'en';
      }

      if (!rawLocale && typeof Intl !== 'undefined') {
        rawLocale = Intl.DateTimeFormat().resolvedOptions().locale;
      }

      const langCode = (rawLocale || 'en').split(/[-_]/)[0].toLowerCase();

      if (langCode in translations) {
        return langCode as SupportedLanguage;
      }

      return 'en';
    } catch (e) {
      return 'en';
    }
  }

  getStrings(lang?: SupportedLanguage): TranslationStrings {
    const activeLang = lang || this.getDeviceLanguage();
    return translations[activeLang] || translations.en;
  }
}

export const localizationService = new LocalizationService();
