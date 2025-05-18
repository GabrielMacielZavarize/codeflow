import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getActivities, logActivity } from '../services/auditService';
import { getUserRole, checkPermission } from '../services/roleService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, AlertOctagon, Clock, Filter, Search } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useLanguage } from '../contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase/config';

const AuditLogs = () => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<AuditActivity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<AuditActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);

        // Verificar permissão
        if (!checkPermission(getUserRole(currentUser.uid), 'canViewAuditLogs')) {
          toast({
            title: t('auditLogs.accessDenied'),
            description: t('auditLogs.noPermission'),
            variant: 'destructive'
          });
          return;
        }

        // Criar query para logs de auditoria
        const auditQuery = query(
          collection(db, 'auditLogs'),
          orderBy('timestamp', 'desc'),
          limit(50)
        );

        // Configurar listener em tempo real
        const unsubscribe = onSnapshot(auditQuery, (snapshot) => {
          const activities: AuditActivity[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            activities.push({
              id: doc.id,
              action: data.action,
              entity: data.entity,
              entityId: data.entityId,
              userId: data.userId,
              userName: data.userName,
              userEmail: data.userEmail,
              details: data.details,
              timestamp: data.timestamp.toDate()
            });
          });
          setActivities(activities);
          setFilteredActivities(activities);
          setIsLoading(false);
        }, (error) => {
          console.error('Erro ao buscar logs:', error);
          setIsLoading(false);
        });

        // Limpar listener quando componente for desmontado
        return () => unsubscribe();
      } catch (error) {
        console.error('Erro ao buscar logs:', error);
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, [currentUser, t]);

  useEffect(() => {
    let filtered = [...activities];

    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.entity.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (actionFilter !== 'all') {
      filtered = filtered.filter(activity => activity.action === actionFilter);
    }

    if (entityFilter !== 'all') {
      filtered = filtered.filter(activity => activity.entity === entityFilter);
    }

    setFilteredActivities(filtered);
  }, [searchTerm, actionFilter, entityFilter, activities]);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create':
        return <Activity className="h-4 w-4" />;
      case 'login':
      case 'logout':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertOctagon className="h-4 w-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300';
      case 'update':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300';
      case 'delete':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300';
      case 'complete':
        return 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300';
      case 'assign':
        return 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const getEntityColor = (entity: string) => {
    switch (entity) {
      case 'task':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300';
      case 'user':
        return 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300';
      case 'team':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300';
      case 'system':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold dark:text-white">{t.auditLogs.title}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{t.auditLogs.description}</p>
        </div>
      </div>

      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="text-xl">{t.auditLogs.filters}</CardTitle>
          <CardDescription>{t.auditLogs.filtersDescription}</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder={t.auditLogs.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                <SelectValue placeholder={t.auditLogs.filterByAction} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.auditLogs.allActions}</SelectItem>
                <SelectItem value="create">{t.auditLogs.actions.create}</SelectItem>
                <SelectItem value="update">{t.auditLogs.actions.update}</SelectItem>
                <SelectItem value="delete">{t.auditLogs.actions.delete}</SelectItem>
                <SelectItem value="complete">{t.auditLogs.actions.complete}</SelectItem>
                <SelectItem value="assign">{t.auditLogs.actions.assign}</SelectItem>
                <SelectItem value="login">{t.auditLogs.actions.login}</SelectItem>
                <SelectItem value="logout">{t.auditLogs.actions.logout}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={entityFilter} onValueChange={setEntityFilter}>
              <SelectTrigger className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                <SelectValue placeholder={t.auditLogs.filterByEntity} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.auditLogs.allEntities}</SelectItem>
                <SelectItem value="task">{t.auditLogs.entities.task}</SelectItem>
                <SelectItem value="user">{t.auditLogs.entities.user}</SelectItem>
                <SelectItem value="team">{t.auditLogs.entities.team}</SelectItem>
                <SelectItem value="system">{t.auditLogs.entities.system}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800 shadow-lg">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="text-xl">{t.auditLogs.activityHistory}</CardTitle>
          <CardDescription>{t.auditLogs.activityDescription}</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <span className="ml-3 dark:text-white">{t.auditLogs.loading}</span>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
              <div className="space-y-4 sm:space-y-6 pl-8 sm:pl-10">
                {filteredActivities.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">{t.auditLogs.noActivities}</p>
                  </div>
                ) : (
                  filteredActivities.map((activity) => (
                    <div key={activity.id} className="relative group">
                      <div className="absolute -left-6 sm:-left-10 top-1 h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700 group-hover:scale-110 transition-transform">
                        {getActionIcon(activity.action)}
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 sm:p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className={`${getActionColor(activity.action)} transition-colors text-xs sm:text-sm`}>
                              {activity.action}
                            </Badge>
                            <Badge variant="secondary" className={`${getEntityColor(activity.entity)} transition-colors text-xs sm:text-sm`}>
                              {activity.entity}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <p className="font-medium dark:text-white text-sm sm:text-base">
                              <span className="text-gray-600 dark:text-gray-400">
                                {activity.userEmail}
                              </span>{' '}
                              {activity.details}
                            </p>
                            {activity.entityId && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                ID: {activity.entityId}
                              </p>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {format(new Date(activity.timestamp), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
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
