import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useLanguage } from '../contexts/LanguageContext';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-[1.2rem] w-[1.2rem]" />;
      case 'dark':
        return <Moon className="h-[1.2rem] w-[1.2rem]" />;
      default:
        return <Sun className="h-[1.2rem] w-[1.2rem]" />;
    }
  };

  const getTooltipText = () => {
    switch (theme) {
      case 'light':
        return t.settings.appearance.dark;
      case 'dark':
        return t.settings.appearance.light;
      default:
        return t.settings.appearance.theme;
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="w-9 h-9 text-gray-700 dark:text-gray-300"
        >
          {getThemeIcon()}
          <span className="sr-only">{t.settings.appearance.theme}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{getTooltipText()}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ThemeToggle;
