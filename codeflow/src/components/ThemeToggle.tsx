
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-[1.2rem] w-[1.2rem]" />;
      case 'dark':
        return <Moon className="h-[1.2rem] w-[1.2rem]" />;
      case 'system':
        return <Monitor className="h-[1.2rem] w-[1.2rem]" />;
      default:
        return <Sun className="h-[1.2rem] w-[1.2rem]" />;
    }
  };

  const getTooltipText = () => {
    switch (theme) {
      case 'light':
        return 'Alternar para modo escuro';
      case 'dark':
        return 'Alternar para modo do sistema';
      case 'system':
        return 'Alternar para modo claro';
      default:
        return 'Alternar tema';
    }
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
          <span className="sr-only">Alternar tema</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{getTooltipText()}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ThemeToggle;
