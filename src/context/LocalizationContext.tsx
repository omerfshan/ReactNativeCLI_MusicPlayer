import React, { createContext, useContext, useMemo } from 'react';
import {
  SupportedLanguage,
  TranslationStrings,
} from '../constants/translations';
import {
  ILocalizationService,
  localizationService,
} from '../services/localizationService';

interface LocalizationContextType {
  language: SupportedLanguage;
  t: TranslationStrings;
}

const defaultContextValue: LocalizationContextType = {
  language: 'en',
  t: localizationService.getStrings('en'),
};

const LocalizationContext =
  createContext<LocalizationContextType>(defaultContextValue);

export const useLocalization = () => useContext(LocalizationContext);

interface LocalizationProviderProps {
  children: React.ReactNode;
  service?: ILocalizationService;
}

export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({
  children,
  service = localizationService,
}) => {
  const language = useMemo(() => service.getDeviceLanguage(), [service]);
  const t = useMemo(() => service.getStrings(language), [language, service]);

  return (
    <LocalizationContext.Provider value={{ language, t }}>
      {children}
    </LocalizationContext.Provider>
  );
};
