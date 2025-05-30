import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { AuditLogHeader } from '@/components/audit/AuditLogHeader';
import { AuditLogList } from '@/components/audit/AuditLogList';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

interface AuditActivity {
  id: string;
  action: string;
  entity: string;
  entityId?: string;
  userId: string;
  userName: string;
  userEmail: string;
  details: string;
  timestamp: Date;
}

const AuditLogs = () => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [activities, setActivities] = useState<AuditActivity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<AuditActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [entityFilter, setEntityFilter] = useState<string>('all');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true);

        const auditQuery = query(
          collection(db, 'auditLogs'),
          orderBy('timestamp', 'desc'),
          limit(50)
        );

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

        return () => unsubscribe();
      } catch (error) {
        console.error('Erro ao buscar logs:', error);
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 space-y-6"
    >
      <AuditLogHeader
        title={t.auditLogs.title}
        description={t.auditLogs.description}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        actionFilter={actionFilter}
        onActionFilterChange={setActionFilter}
        entityFilter={entityFilter}
        onEntityFilterChange={setEntityFilter}
        translations={{
          filters: t.auditLogs.filters,
          filtersDescription: t.auditLogs.filtersDescription,
          searchPlaceholder: t.auditLogs.searchPlaceholder,
          filterByAction: t.auditLogs.filterByAction,
          filterByEntity: t.auditLogs.filterByEntity,
          allActions: t.auditLogs.allActions,
          allEntities: t.auditLogs.allEntities,
          actions: t.auditLogs.actions,
          entities: t.auditLogs.entities
        }}
      />

      <AuditLogList
        activities={filteredActivities}
        isLoading={isLoading}
        translations={{
          activityHistory: t.auditLogs.activityHistory,
          activityDescription: t.auditLogs.activityDescription,
          loading: t.auditLogs.loading,
          noActivities: t.auditLogs.noActivities
        }}
      />
    </motion.div>
  );
};

export default AuditLogs;
