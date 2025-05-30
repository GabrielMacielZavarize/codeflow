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
  // Versão mock para desenvolvimento
  return { ...mockUserSettings, userId };
};

export const saveUserSettings = async (userId: string, settings: Partial<UserSettings>): Promise<void> => {
  // Versão mock para desenvolvimento
  console.log('Salvando configurações:', { userId, settings });
  return Promise.resolve();
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
    await setDoc(doc(db, 'configuracoes', userId), {
      ...settings,
      dataAtualizacao: Timestamp.fromDate(new Date())
    });
    return true;
  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
    return false;
  }
};
