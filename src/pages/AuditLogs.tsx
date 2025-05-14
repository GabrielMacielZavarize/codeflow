import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getActivities, AuditActivity } from '../services/auditService';
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

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        if (currentUser) {
          const userRole = getUserRole(currentUser.uid);
          const canView = checkPermission(userRole, 'canViewAuditLogs');

          if (!canView) {
            toast.error(t.auditLogs.accessDenied);
            navigate('/unauthorized');
            return;
          }

          const data = await getActivities();
          setActivities(data);
          setFilteredActivities(data);
        }
      } catch (error) {
        console.error('Erro ao carregar logs de auditoria:', error);
        toast.error(t.auditLogs.errorLoading);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [currentUser, navigate, t]);

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
        return <Activity className="h-4 w-4 mr-2" />;
      case 'login':
      case 'logout':
        return <Clock className="h-4 w-4 mr-2" />;
      default:
        return <AlertOctagon className="h-4 w-4 mr-2" />;
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold dark:text-white">{t.auditLogs.title}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t.auditLogs.description}</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t.auditLogs.filters}</CardTitle>
          <CardDescription>{t.auditLogs.filtersDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder={t.auditLogs.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger>
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
              <SelectTrigger>
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

      <Card>
        <CardHeader>
          <CardTitle>{t.auditLogs.activityHistory}</CardTitle>
          <CardDescription>{t.auditLogs.activityDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <span className="ml-3 dark:text-white">{t.auditLogs.loading}</span>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
              <div className="space-y-6 pl-10 py-4">
                {filteredActivities.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400">{t.auditLogs.noActivities}</p>
                ) : (
                  filteredActivities.map((activity) => (
                    <div key={activity.id} className="relative">
                      <div className="absolute -left-10 top-1 h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        {getActionIcon(activity.action)}
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="secondary" className={getActionColor(activity.action)}>
                                {activity.action}
                              </Badge>
                              <Badge variant="secondary" className={getEntityColor(activity.entity)}>
                                {activity.entity}
                              </Badge>
                            </div>
                            <p className="font-medium dark:text-white">
                              <span className="text-gray-600 dark:text-gray-400">
                                {activity.userEmail}
                              </span>{' '}
                              {activity.details}
                            </p>
                            {activity.entityId && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                ID: {activity.entityId}
                              </p>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
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
