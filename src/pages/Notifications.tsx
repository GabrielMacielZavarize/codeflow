import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Notification, getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../services/notificationService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Bell, Check, Trash2, Filter } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useLanguage } from '../contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Notifications = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const { t } = useLanguage();

  useEffect(() => {
    const loadNotifications = async () => {
      if (currentUser) {
        setIsLoading(true);
        try {
          const fetchedNotifications = await getNotifications(currentUser.uid);
          setNotifications(fetchedNotifications);
        } catch (error) {
          console.error('Erro ao carregar notificações:', error);
          toast.error('Não foi possível obter suas notificações.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadNotifications();
  }, [currentUser]);

  const handleMarkAsRead = async (id: string) => {
    try {
      const success = await markNotificationAsRead(id);

      if (success) {
        setNotifications(notifications.map(notification =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        ));

        toast.success('A notificação foi atualizada com sucesso.');
      }
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      toast.error('Não foi possível marcar a notificação como lida.');
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!currentUser) return;

    try {
      const success = await markAllNotificationsAsRead(currentUser.uid);

      if (success) {
        setNotifications(notifications.map(notification => ({ ...notification, read: true })));
        toast.success('Todas as notificações foram marcadas como lidas.');
      }
    } catch (error) {
      console.error('Erro ao marcar todas notificações como lidas:', error);
      toast.error('Não foi possível marcar todas as notificações como lidas.');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task_assigned':
        return '📝';
      case 'task_due':
        return '⏰';
      case 'task_completed':
        return '✅';
      case 'comment':
        return '💬';
      case 'mention':
        return '@';
      default:
        return '🔔';
    }
  };

  const getTimeAgo = (date: Date) => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: ptBR
    });
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {t.navigation.notifications}
          </h1>
          {unreadCount > 0 && (
            <Badge className="ml-3 bg-primary">{unreadCount} novas</Badge>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={filter} onValueChange={(value) => setFilter(value as 'all' | 'unread' | 'read')}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filtrar notificações" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="unread">Não lidas</SelectItem>
              <SelectItem value="read">Lidas</SelectItem>
            </SelectContent>
          </Select>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={handleMarkAllAsRead}
              className="w-full sm:w-auto"
            >
              <Check className="h-4 w-4 mr-2" />
              Marcar todas como lidas
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <span className="ml-3">Carregando notificações...</span>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-gray-400" />
            <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              Nenhuma notificação
            </h2>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Você não tem notificações no momento
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map(notification => (
            <Card
              key={notification.id}
              className={`transition-all duration-200 hover:shadow-md ${!notification.read ? 'border-l-4 border-l-primary' : ''
                }`}
            >
              <div className="flex flex-col sm:flex-row p-4 sm:p-6 gap-4">
                <div className="flex-shrink-0 text-2xl">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-grow min-w-0">
                  <p className={`text-base ${!notification.read ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                    {notification.message}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {getTimeAgo(notification.createdAt)}
                  </p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-2">
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="text-primary hover:text-primary/90"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Marcar como lida</span>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
