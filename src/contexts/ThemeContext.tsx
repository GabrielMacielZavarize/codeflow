
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
    
    // Verifica se o tema salvo é válido (light, dark ou system)
    if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
      return savedTheme as ThemeOption;
    }
    
    // Caso contrário, usa a preferência do sistema
    return 'system';
  });
  
  const applyTheme = (themeToApply: ThemeOption) => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (themeToApply === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(themeToApply);
    }
  };

  // Aplicar o tema quando ele mudar
  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('codeflow-theme', theme);
  }, [theme]);

  // Observar mudanças na preferência do sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const setTheme = (newTheme: ThemeOption) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prevTheme => {
      if (prevTheme === 'light') return 'dark';
      if (prevTheme === 'dark') return 'system';
      return 'light';
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
