
import React, { createContext, useContext, useState, useEffect } from 'react';
import { dictionaries, Dictionary, LanguageOption } from '../i18n';
import { useAuth } from './AuthContext';
import { getUserSettings, updateUserSettings } from '../services/settingsService';

interface LanguageContextType {
  language: LanguageOption;
  setLanguage: (lang: LanguageOption) => Promise<void>;
  t: Dictionary;
}

const defaultLanguage: LanguageOption = 'pt-BR';

const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  setLanguage: async () => {},
  t: dictionaries[defaultLanguage]
});

export const useLanguage = () => {
  return useContext(LanguageContext);
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [language, setLanguageState] = useState<LanguageOption>(defaultLanguage);
  const [dictionary, setDictionary] = useState<Dictionary>(dictionaries[defaultLanguage]);

  useEffect(() => {
    const loadLanguagePreference = async () => {
      try {
        if (currentUser) {
          const settings = await getUserSettings(currentUser.uid);
          const userLanguage = settings?.language || defaultLanguage;
          setLanguageState(userLanguage);
          setDictionary(dictionaries[userLanguage]);
          console.log(`Loaded user language preference: ${userLanguage}`);
        } else {
          // If user is not logged in, try to load from localStorage
          const savedLanguage = localStorage.getItem('appLanguage') as LanguageOption | null;
          if (savedLanguage && Object.keys(dictionaries).includes(savedLanguage)) {
            setLanguageState(savedLanguage);
            setDictionary(dictionaries[savedLanguage]);
            console.log(`Loaded language from localStorage: ${savedLanguage}`);
          }
        }
      } catch (error) {
        console.error('Error loading language settings:', error);
      }
    };

    loadLanguagePreference();
  }, [currentUser]);

  const setLanguage = async (lang: LanguageOption) => {
    try {
      setLanguageState(lang);
      setDictionary(dictionaries[lang]);
      
      // Always save to localStorage for non-logged in users
      localStorage.setItem('appLanguage', lang);
      console.log(`Saved language to localStorage: ${lang}`);
      
      if (currentUser) {
        await updateUserSettings(currentUser.uid, { language: lang });
        console.log(`Updated user language setting in database: ${lang}`);
      }
    } catch (error) {
      console.error('Error updating language setting:', error);
    }
  };

  const value = {
    language,
    setLanguage,
    t: dictionary
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
