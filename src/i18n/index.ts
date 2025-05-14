import { enUS } from './en-US';
import { ptBR } from './pt-BR';
import { es } from './es';

export type LanguageOption = 'en-US' | 'pt-BR' | 'es';

export const dictionaries = {
  'en-US': enUS,
  'pt-BR': ptBR,
  'es': es
};

export type Dictionary = typeof enUS;

// Helper para carregar locale do date-fns baseado na opção de idioma
export const getDateLocale = async (language: LanguageOption) => {
  switch (language) {
    case 'pt-BR':
      return (await import('date-fns/locale/pt-BR')).ptBR;
    case 'es':
      return (await import('date-fns/locale/es')).es;
    default:
      return (await import('date-fns/locale/en-US')).enUS;
  }
};

