import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeOption } from '../services/settingsService';

interface ThemeContextType {
  theme: ThemeOption;
  setTheme: (theme: ThemeOption) => void;
  toggleTheme: () => void;
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
  const [theme, setThemeState] = useState<ThemeOption>(() => {
    // Tenta recuperar o tema do localStorage
    const savedTheme = localStorage.getItem('codeflow-theme');

    // Verifica se o tema salvo é válido (light ou dark)
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme as ThemeOption;
    }

    // Caso contrário, usa light como padrão
    return 'light';
  });

  const applyTheme = (themeToApply: ThemeOption) => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(themeToApply);
  };

  // Aplicar o tema quando ele mudar
  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('codeflow-theme', theme);
  }, [theme]);

  const setTheme = (newTheme: ThemeOption) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
