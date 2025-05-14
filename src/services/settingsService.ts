
export type ThemeOption = 'light' | 'dark' | 'system';
export type LanguageOption = 'pt-BR' | 'en-US' | 'es';

export interface UserSettings {
  userId: string;
  theme: ThemeOption;
  language: LanguageOption;
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  taskReminders: boolean;
}

// Mock de configurações do usuário
const mockUserSettings: UserSettings = {
  userId: 'mock-user-id',
  theme: 'light',
  language: 'pt-BR',
  emailNotifications: true,
  pushNotifications: true,
  weeklyDigest: false,
  taskReminders: true
};

// Funções para gerenciar configurações
export const getUserSettings = async (userId: string): Promise<UserSettings> => {
  // Versão mock para desenvolvimento
  return { ...mockUserSettings, userId };
};

export const updateUserSettings = async (userId: string, settings: Partial<UserSettings>): Promise<boolean> => {
  console.log(`Configurações do usuário ${userId} atualizadas (mock):`, settings);
  return true;
};
