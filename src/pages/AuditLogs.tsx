import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getActivities, AuditActivity } from '../services/auditService';
import { getUserRole, checkPermission } from '../services/roleService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, AlertOctagon, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const AuditLogs = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [activities, setActivities] = useState<AuditActivity[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        if (currentUser) {
          const userRole = getUserRole(currentUser.uid);
          const canView = checkPermission(userRole, 'canViewAuditLogs');
          
          if (!canView) {
            toast({
              title: "Acesso negado",
              description: "Você não tem permissão para visualizar os logs de auditoria.",
              variant: "destructive"
            });
            return;
          }
          
          const data = await getActivities();
          setActivities(data);
        }
      } catch (error) {
        console.error('Erro ao carregar logs de auditoria:', error);
        toast({
          title: "Erro ao carregar logs",
          description: "Não foi possível obter o histórico de atividades.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchActivities();
  }, [currentUser, toast]);
  
  const getActionIcon = (action: string) => {
    switch(action) {
      case 'create':
        return <Activity className="h-4 w-4 mr-2" />;
      case 'login':
      case 'logout':
        return <Clock className="h-4 w-4 mr-2" />;
      default:
        return <AlertOctagon className="h-4 w-4 mr-2" />;
    }
  };
  
  const getActionColor = (action: string) => {
    switch(action) {
      case 'create':
        return 'text-green-500';
      case 'update':
        return 'text-blue-500';
      case 'delete':
        return 'text-red-500';
      case 'complete':
        return 'text-purple-500';
      case 'assign':
        return 'text-orange-500';
      default:
        return 'text-gray-500';
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Logs de Auditoria</h1>
        <p className="text-gray-600 dark:text-gray-400">Timeline de atividades do sistema</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Atividades</CardTitle>
          <CardDescription>Registro de ações realizadas no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <span className="ml-3">Carregando logs...</span>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
              <div className="space-y-6 pl-10 py-4">
                {activities.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">Nenhuma atividade registrada.</p>
                ) : (
                  activities.map((activity) => (
                    <div key={activity.id} className="relative">
                      <div className="absolute -left-10 top-1 h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        {getActionIcon(activity.action)}
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">
                              <span className={getActionColor(activity.action)}>
                                {activity.userEmail}
                              </span>{' '}
                              {activity.details}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {activity.entity} {activity.entityId ? `(${activity.entityId})` : ''}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {format(new Date(activity.timestamp), 'dd/MM/yyyy HH:mm')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogs;
