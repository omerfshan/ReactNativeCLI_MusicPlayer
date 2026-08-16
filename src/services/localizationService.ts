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
 * Accurately prioritizes iOS AppleLanguages array and Android localeIdentifier.
 */
export class LocalizationService implements ILocalizationService {
  getDeviceLanguage(): SupportedLanguage {
    try {
      let rawLocale = '';

      if (Platform.OS === 'ios') {
        const appleLanguages =
          NativeModules.SettingsManager?.settings?.AppleLanguages;
        if (Array.isArray(appleLanguages) && appleLanguages.length > 0) {
          rawLocale = appleLanguages[0];
        } else if (NativeModules.SettingsManager?.settings?.AppleLocale) {
          rawLocale = NativeModules.SettingsManager.settings.AppleLocale;
        }
      } else {
        rawLocale = NativeModules.I18nManager?.localeIdentifier || '';
      }

      if (!rawLocale && typeof Intl !== 'undefined') {
        rawLocale = Intl.DateTimeFormat().resolvedOptions().locale;
      }

      const langCode = (rawLocale || 'tr').split(/[-_]/)[0].toLowerCase();

      if (langCode in translations) {
        return langCode as SupportedLanguage;
      }

      return 'tr';
    } catch (e) {
      return 'tr';
    }
  }

  getStrings(lang?: SupportedLanguage): TranslationStrings {
    const activeLang = lang || this.getDeviceLanguage();
    return translations[activeLang] || translations.tr;
  }
}

export const localizationService = new LocalizationService();
