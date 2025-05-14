
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Notification, getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../services/notificationService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Notifications = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadNotifications = async () => {
      if (currentUser) {
        setIsLoading(true);
        try {
          const fetchedNotifications = await getNotifications(currentUser.uid);
          setNotifications(fetchedNotifications);
        } catch (error) {
          console.error('Erro ao carregar notificações:', error);
          toast({
            title: 'Erro ao carregar notificações',
            description: 'Não foi possível obter suas notificações.',
            variant: 'destructive'
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadNotifications();
  }, [currentUser, toast]);
  
  const handleMarkAsRead = async (id: string) => {
    try {
      const success = await markNotificationAsRead(id);
      
      if (success) {
        setNotifications(notifications.map(notification => 
          notification.id === id 
            ? { ...notification, read: true } 
            : notification
        ));
        
        toast({
          title: 'Notificação marcada como lida',
          description: 'A notificação foi atualizada com sucesso.'
        });
      }
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      toast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível marcar a notificação como lida.',
        variant: 'destructive'
      });
    }
  };
  
  const handleMarkAllAsRead = async () => {
    if (!currentUser) return;
    
    try {
      const success = await markAllNotificationsAsRead(currentUser.uid);
      
      if (success) {
        setNotifications(notifications.map(notification => ({ ...notification, read: true })));
        
        toast({
          title: 'Todas notificações lidas',
          description: 'Todas as notificações foram marcadas como lidas.'
        });
      }
    } catch (error) {
      console.error('Erro ao marcar todas notificações como lidas:', error);
      toast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível marcar todas as notificações como lidas.',
        variant: 'destructive'
      });
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
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold">Notificações</h1>
          {unreadCount > 0 && (
            <Badge className="ml-3 bg-primary">{unreadCount} novas</Badge>
          )}
        </div>
        
        {unreadCount > 0 && (
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            Marcar todas como lidas
          </Button>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <span className="ml-3">Carregando notificações...</span>
        </div>
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-gray-400" />
            <h2 className="mt-4 text-xl font-semibold">Nenhuma notificação</h2>
            <p className="mt-1 text-gray-500">
              Você não tem notificações no momento
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map(notification => (
            <Card key={notification.id} className={!notification.read ? 'border-l-4 border-l-primary' : ''}>
              <div className="flex p-4 md:p-6">
                <div className="flex-shrink-0 text-2xl mr-4">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-grow">
                  <p className={`${!notification.read ? 'font-semibold' : ''}`}>
                    {notification.message}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {getTimeAgo(notification.createdAt)}
                  </p>
                </div>
                <div className="flex-shrink-0 ml-4">
                  {!notification.read && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      Marcar como lida
                    </Button>
                  )}
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
