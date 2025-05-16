import React, { createContext, useContext, useState, useEffect } from 'react';
import { ptBR } from '@/i18n/pt-BR';
import { enUS } from '@/i18n/en-US';
import { es } from '@/i18n/es';

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  t: typeof ptBR;
};

const translations = {
  'pt-BR': ptBR,
  'en-US': enUS,
  'es': es
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'pt-BR',
  setLanguage: () => { },
  t: ptBR
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('language') || 'pt-BR';
  });
  const [currentTranslations, setCurrentTranslations] = useState(ptBR);

  useEffect(() => {
    setCurrentTranslations(translations[language as keyof typeof translations]);
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const value = {
    language,
    setLanguage,
    t: currentTranslations
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
