
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserSettings, getUserSettings, updateUserSettings, ThemeOption, LanguageOption } from '../services/settingsService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

const Settings = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const { theme: currentTheme, setTheme } = useTheme();
  const { language: currentLanguage, setLanguage, t } = useLanguage();
  
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  useEffect(() => {
    const loadSettings = async () => {
      if (currentUser) {
        setIsLoading(true);
        try {
          const userSettings = await getUserSettings(currentUser.uid);
          setSettings(userSettings);
        } catch (error) {
          console.error('Erro ao carregar configurações:', error);
          toast({
            title: t.general.error,
            description: t.settings.saveError,
            variant: 'destructive'
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadSettings();
  }, [currentUser, toast, t]);
  
  const handleThemeChange = async (theme: string) => {
    if (!settings || !currentUser) return;
    
    // Aplicar o tema imediatamente
    setTheme(theme as ThemeOption);
    
    setSettings(prevSettings => {
      if (!prevSettings) return null;
      return {
        ...prevSettings,
        theme: theme as ThemeOption
      };
    });
    
    setHasChanges(true);
  };
  
  const handleLanguageChange = async (language: string) => {
    if (!settings || !currentUser) return;
    
    // Aplicar o idioma imediatamente
    await setLanguage(language as LanguageOption);
    
    setSettings(prevSettings => {
      if (!prevSettings) return null;
      return {
        ...prevSettings,
        language: language as LanguageOption
      };
    });
    
    setHasChanges(true);
  };
  
  const handleNotificationToggle = async (key: keyof UserSettings, value: boolean) => {
    if (!settings || !currentUser) return;
    
    setSettings(prevSettings => {
      if (!prevSettings) return null;
      return {
        ...prevSettings,
        [key]: value
      };
    });
    
    setHasChanges(true);
  };
  
  const handleSaveSettings = async () => {
    if (!settings || !currentUser) return;
    
    setIsSaving(true);
    try {
      await updateUserSettings(currentUser.uid, settings);
      toast({
        title: t.general.success,
        description: t.settings.saveSuccess
      });
      setHasChanges(false);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: t.general.error,
        description: t.settings.saveError,
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <span className="ml-3">{t.general.loading}</span>
        </div>
      </div>
    );
  }
  
  if (!settings) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <SettingsIcon className="h-12 w-12 mx-auto text-gray-400" />
          <h2 className="text-2xl font-bold mt-4">{t.general.error}</h2>
          <p className="mt-2 text-gray-500">{t.settings.saveError}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            {t.general.tryAgain}
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t.settings.title}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t.settings.subtitle}
        </p>
      </div>
      
      <Tabs defaultValue="account" className="space-y-6">
        <div className="border-b overflow-x-auto">
          <TabsList className="w-full sm:w-auto flex">
            <TabsTrigger value="account" className="flex-1 sm:flex-initial">
              {t.settings.account.title}
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex-1 sm:flex-initial">
              {t.settings.appearance.title}
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex-1 sm:flex-initial">
              {t.settings.notifications.title}
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>{t.settings.account.title}</CardTitle>
              <CardDescription>
                {t.settings.account.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>{t.settings.account.email}</Label>
                <p className="text-gray-700 dark:text-gray-300">{currentUser?.email || '-'}</p>
              </div>
              
              <div className="space-y-4">
                <Label>{t.settings.language.title}</Label>
                <RadioGroup 
                  value={settings.language} 
                  onValueChange={handleLanguageChange}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pt-BR" id="lang-pt" />
                    <Label htmlFor="lang-pt">{t.settings.language.ptBR}</Label>
                    {currentLanguage === 'pt-BR' && (
                      <Check size={16} className="text-green-500 ml-1" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="en-US" id="lang-en" />
                    <Label htmlFor="lang-en">{t.settings.language.enUS}</Label>
                    {currentLanguage === 'en-US' && (
                      <Check size={16} className="text-green-500 ml-1" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="es" id="lang-es" />
                    <Label htmlFor="lang-es">{t.settings.language.es}</Label>
                    {currentLanguage === 'es' && (
                      <Check size={16} className="text-green-500 ml-1" />
                    )}
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>{t.settings.appearance.title}</CardTitle>
              <CardDescription>
                {t.settings.appearance.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>{t.settings.appearance.theme}</Label>
                <RadioGroup 
                  value={settings.theme} 
                  onValueChange={handleThemeChange}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="theme-light" />
                    <Label htmlFor="theme-light">{t.settings.appearance.light}</Label>
                    {currentTheme === 'light' && (
                      <Check size={16} className="text-green-500 ml-1" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dark" id="theme-dark" />
                    <Label htmlFor="theme-dark">{t.settings.appearance.dark}</Label>
                    {currentTheme === 'dark' && (
                      <Check size={16} className="text-green-500 ml-1" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="system" id="theme-system" />
                    <Label htmlFor="theme-system">{t.settings.appearance.system}</Label>
                    {currentTheme === 'system' && (
                      <Check size={16} className="text-green-500 ml-1" />
                    )}
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>{t.settings.notifications.title}</CardTitle>
              <CardDescription>
                {t.settings.notifications.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <Label htmlFor="email-notifications" className="text-base">{t.settings.notifications.email.title}</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.settings.notifications.email.description}</p>
                </div>
                <Switch 
                  id="email-notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleNotificationToggle('emailNotifications', checked)}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <Label htmlFor="push-notifications" className="text-base">{t.settings.notifications.push.title}</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.settings.notifications.push.description}</p>
                </div>
                <Switch 
                  id="push-notifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleNotificationToggle('pushNotifications', checked)}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <Label htmlFor="weekly-digest" className="text-base">{t.settings.notifications.digest.title}</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.settings.notifications.digest.description}</p>
                </div>
                <Switch 
                  id="weekly-digest"
                  checked={settings.weeklyDigest}
                  onCheckedChange={(checked) => handleNotificationToggle('weeklyDigest', checked)}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <Label htmlFor="task-reminders" className="text-base">{t.settings.notifications.reminders.title}</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.settings.notifications.reminders.description}</p>
                </div>
                <Switch 
                  id="task-reminders"
                  checked={settings.taskReminders}
                  onCheckedChange={(checked) => handleNotificationToggle('taskReminders', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end mt-8">
        <Button 
          onClick={handleSaveSettings} 
          disabled={isSaving || !hasChanges}
          className={`${hasChanges ? 'animate-pulse' : ''}`}
        >
          {isSaving ? t.settings.saving : t.settings.saveButton}
        </Button>
      </div>
    </div>
  );
};

export default Settings;
