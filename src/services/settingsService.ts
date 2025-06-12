import { db } from '@/lib/firebase/config';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';

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
  dataAtualizacao?: Date;
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
  try {
    const settings = await getSettings(userId);
    if (settings) {
      return settings;
    }

    // Se não existir configurações, criar com valores padrão
    const defaultSettings: UserSettings = {
      userId,
      theme: 'system',
      language: 'pt-BR',
      emailNotifications: true,
      pushNotifications: true,
      weeklyDigest: false,
      taskReminders: true,
      dataAtualizacao: new Date()
    };

    // Salvar configurações padrão
    await saveSettings(userId, defaultSettings);
    return defaultSettings;
  } catch (error) {
    console.error('Erro ao buscar configurações do usuário:', error);
    throw new Error('Falha ao buscar configurações');
  }
};

export const saveUserSettings = async (userId: string, settings: Partial<UserSettings>): Promise<void> => {
  try {
    // Buscar configurações atuais
    const currentSettings = await getSettings(userId);

    // Combinar configurações atuais com as novas
    const updatedSettings: UserSettings = {
      ...currentSettings,
      ...settings,
      userId,
      dataAtualizacao: new Date()
    } as UserSettings;

    // Salvar no Firestore
    await saveSettings(userId, updatedSettings);
  } catch (error) {
    console.error('Erro ao salvar configurações do usuário:', error);
    throw new Error('Falha ao salvar configurações');
  }
};

export const getSettings = async (userId: string): Promise<UserSettings | null> => {
  try {
    const docRef = doc(db, 'configuracoes', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        dataAtualizacao: data.dataAtualizacao?.toDate()
      } as UserSettings;
    }

    return null;
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    return null;
  }
};

export const saveSettings = async (userId: string, settings: UserSettings): Promise<boolean> => {
  try {
    await setDoc(doc(db, 'userSettings', userId), settings);
    return true;
  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
    return false;
  }
};
