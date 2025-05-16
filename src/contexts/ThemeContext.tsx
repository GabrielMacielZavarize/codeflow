import React, { createContext, useContext, useEffect, useState } from 'react';
import { getUserSettings, saveUserSettings } from '../services/settingsService';
import { useAuth } from './AuthContext';

type ThemeOption = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeOption;
  setTheme: (theme: ThemeOption) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeOption>('system');
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadUserTheme = async () => {
      if (currentUser) {
        try {
          const settings = await getUserSettings(currentUser.uid);
          if (settings.theme) {
            setThemeState(settings.theme);
          }
        } catch (error) {
          console.error('Erro ao carregar configurações de tema:', error);
        }
      }
    };

    loadUserTheme();
  }, [currentUser]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const setTheme = async (newTheme: ThemeOption) => {
    try {
      setThemeState(newTheme);
      localStorage.setItem('theme', newTheme);

      // Aplicar o tema imediatamente
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');

      if (newTheme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
      } else {
        root.classList.add(newTheme);
      }

      // Salvar no banco de dados se houver usuário logado
      if (currentUser) {
        await saveUserSettings(currentUser.uid, { theme: newTheme });
      }
    } catch (error) {
      console.error('Erro ao salvar configurações de tema:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
