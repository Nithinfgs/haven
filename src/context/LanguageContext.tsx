import React, { createContext, useContext, useState } from 'react';
import { LANGUAGES, TRANSLATIONS, type SupportedLanguage, type LanguageOption } from '../i18n';
import { getMockDatabase } from '../mockData';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;
  languages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const db = getMockDatabase();
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('haven_language') as SupportedLanguage;
    if (saved && ['en', 'ta', 'hi', 'ur', 'kn', 'te'].includes(saved)) {
      return saved;
    }
    const userProfile = db.getUserProfile();
    return (userProfile.language as SupportedLanguage) || 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('haven_language', lang);
    const user = db.getUserProfile();
    db.setUserProfile({ ...user, language: lang });
  };

  const t = (key: string, fallback?: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
