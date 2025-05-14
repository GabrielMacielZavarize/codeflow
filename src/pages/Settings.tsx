import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserSettings, getUserSettings, saveUserSettings, ThemeOption, LanguageOption } from '../services/settingsService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, Check, User, Palette, Bell, Globe, Shield, Key, Save, AlertCircle } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Settings = () => {
  const { currentUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [settings, setSettings] = useState<UserSettings>({
    userId: '',
    theme: 'light',
    language: 'pt-BR',
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: false,
    taskReminders: true
  });
  const [isSaving, setIsSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      if (currentUser) {
        try {
          const userSettings = await getUserSettings(currentUser.uid);
          setSettings(userSettings);
        } catch (error) {
          console.error('Erro ao carregar configurações:', error);
          toast.error(t.settings.saveError);
        }
      }
    };

    loadSettings();
  }, [currentUser, t]);

  const handleThemeChange = async (newTheme: ThemeOption) => {
    try {
      setTheme(newTheme);
      setSettings(prev => ({ ...prev, theme: newTheme }));
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
      toast.error(t.settings.saveError);
    }
  };

  const handleLanguageChange = async (newLanguage: LanguageOption) => {
    try {
      await setLanguage(newLanguage);
      setSettings(prev => ({ ...prev, language: newLanguage }));
    } catch (error) {
      console.error('Erro ao salvar idioma:', error);
      toast.error(t.settings.saveError);
    }
  };

  const handleNotificationChange = async (key: keyof UserSettings, value: boolean) => {
    try {
      setSettings(prev => ({ ...prev, [key]: value }));
    } catch (error) {
      console.error('Erro ao salvar configurações de notificação:', error);
      toast.error(t.settings.saveError);
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      if (currentUser) {
        await saveUserSettings(currentUser.uid, settings);
        toast.success(t.settings.saveSuccess);
      }
    } catch (error) {
      console.error('Erro ao salvar todas as configurações:', error);
      toast.error(t.settings.saveError);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error(t.settings.security.passwordMismatch);
      return;
    }
    // Implementar lógica de mudança de senha
    toast.success(t.settings.security.passwordChanged);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-2 bg-primary/10 rounded-lg">
          <SettingsIcon className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold dark:text-white">{t.settings.title}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t.settings.subtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="" alt={currentUser?.email || ""} />
                  <AvatarFallback className="text-lg">
                    {currentUser?.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-xl truncate">{currentUser?.email}</CardTitle>
                  <Badge variant="secondary" className="mt-1">Administrador</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Membro desde</span>
                  </div>
                  <span className="text-sm font-medium">Jan 2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Nível de acesso</span>
                  </div>
                  <Badge variant="outline">Admin</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="account" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="account" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{t.settings.account.title}</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">{t.settings.appearance.title}</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">{t.settings.notifications.title}</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Segurança</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {t.settings.account.title}
                  </CardTitle>
                  <CardDescription>
                    {t.settings.account.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label>{t.settings.account.email}</Label>
                      <div className="flex items-center gap-2">
                        <Input value={currentUser?.email || ''} disabled />
                        <Badge variant="outline">Verificado</Badge>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <Label>{t.settings.language.title}</Label>
                      <RadioGroup
                        value={settings.language}
                        onValueChange={handleLanguageChange}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                      >
                        <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                          <RadioGroupItem value="pt-BR" id="lang-pt" />
                          <Label htmlFor="lang-pt" className="flex-1 cursor-pointer">
                            {t.settings.language.ptBR}
                          </Label>
                          {language === 'pt-BR' && (
                            <Check size={16} className="text-green-500" />
                          )}
                        </div>
                        <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                          <RadioGroupItem value="en-US" id="lang-en" />
                          <Label htmlFor="lang-en" className="flex-1 cursor-pointer">
                            {t.settings.language.enUS}
                          </Label>
                          {language === 'en-US' && (
                            <Check size={16} className="text-green-500" />
                          )}
                        </div>
                        <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                          <RadioGroupItem value="es" id="lang-es" />
                          <Label htmlFor="lang-es" className="flex-1 cursor-pointer">
                            {t.settings.language.es}
                          </Label>
                          {language === 'es' && (
                            <Check size={16} className="text-green-500" />
                          )}
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    {t.settings.appearance.title}
                  </CardTitle>
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
                      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                    >
                      <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                        <RadioGroupItem value="light" id="theme-light" />
                        <Label htmlFor="theme-light" className="flex-1 cursor-pointer">
                          {t.settings.appearance.light}
                        </Label>
                        {theme === 'light' && (
                          <Check size={16} className="text-green-500" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                        <RadioGroupItem value="dark" id="theme-dark" />
                        <Label htmlFor="theme-dark" className="flex-1 cursor-pointer">
                          {t.settings.appearance.dark}
                        </Label>
                        {theme === 'dark' && (
                          <Check size={16} className="text-green-500" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                        <RadioGroupItem value="system" id="theme-system" />
                        <Label htmlFor="theme-system" className="flex-1 cursor-pointer">
                          {t.settings.appearance.system}
                        </Label>
                        {theme === 'system' && (
                          <Check size={16} className="text-green-500" />
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
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    {t.settings.notifications.title}
                  </CardTitle>
                  <CardDescription>
                    {t.settings.notifications.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-base">{t.settings.notifications.email.title}</Label>
                        <p className="text-sm text-gray-500">
                          {t.settings.notifications.email.description}
                        </p>
                      </div>
                      <Switch
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-base">{t.settings.notifications.push.title}</Label>
                        <p className="text-sm text-gray-500">
                          {t.settings.notifications.push.description}
                        </p>
                      </div>
                      <Switch
                        checked={settings.pushNotifications}
                        onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-base">{t.settings.notifications.digest.title}</Label>
                        <p className="text-sm text-gray-500">
                          {t.settings.notifications.digest.description}
                        </p>
                      </div>
                      <Switch
                        checked={settings.weeklyDigest}
                        onCheckedChange={(checked) => handleNotificationChange('weeklyDigest', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-0.5">
                        <Label className="text-base">{t.settings.notifications.reminders.title}</Label>
                        <p className="text-sm text-gray-500">
                          {t.settings.notifications.reminders.description}
                        </p>
                      </div>
                      <Switch
                        checked={settings.taskReminders}
                        onCheckedChange={(checked) => handleNotificationChange('taskReminders', checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Segurança
                  </CardTitle>
                  <CardDescription>
                    Gerencie suas configurações de segurança e senha
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Dica de segurança</AlertTitle>
                    <AlertDescription>
                      Use uma senha forte e única para sua conta. Recomendamos usar uma combinação de letras, números e caracteres especiais.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label>Senha atual</Label>
                      <Input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Digite sua senha atual"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label>Nova senha</Label>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Digite sua nova senha"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label>Confirmar nova senha</Label>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirme sua nova senha"
                      />
                    </div>

                    <Button onClick={handlePasswordChange} className="w-full">
                      <Key className="h-4 w-4 mr-2" />
                      Alterar senha
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end">
            <Button onClick={handleSaveAll} disabled={isSaving} className="gap-2">
              {isSaving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {t.settings.saving}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {t.settings.saveButton}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
