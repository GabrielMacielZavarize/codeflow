import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Activity, AlertOctagon, Clock, User, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AuditLogItemProps {
    activity: {
        id: string;
        action: string;
        entity: string;
        entityId?: string;
        userEmail: string;
        details: string;
        timestamp: Date;
    };
    index: number;
}

const AuditLogItem = forwardRef<HTMLDivElement, AuditLogItemProps>(({ activity, index }, ref) => {
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
                return 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300';
            case 'update':
                return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300';
            case 'delete':
                return 'bg-rose-100 dark:bg-rose-900/20 text-rose-800 dark:text-rose-300';
            case 'complete':
                return 'bg-violet-100 dark:bg-violet-900/20 text-violet-800 dark:text-violet-300';
            case 'assign':
                return 'bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300';
            default:
                return 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300';
        }
    };

    const getEntityColor = (entity: string) => {
        switch (entity) {
            case 'task':
                return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300';
            case 'user':
                return 'bg-violet-100 dark:bg-violet-900/20 text-violet-800 dark:text-violet-300';
            case 'team':
                return 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300';
            case 'system':
                return 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300';
            default:
                return 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300';
        }
    };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="relative group"
        >
            <motion.div
                whileHover={{ scale: 1.02 }}
                className="absolute -left-6 sm:-left-10 top-1 h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center border border-primary/20 group-hover:border-primary/40 transition-all duration-200"
            >
                {getActionIcon(activity.action)}
            </motion.div>
            <motion.div
                whileHover={{ scale: 1.01 }}
                className="bg-gradient-to-br from-background/80 via-background/90 to-muted/30 backdrop-blur-sm rounded-lg p-2 sm:p-4 border border-primary/10 hover:border-primary/20 transition-all duration-200"
            >
                <div className="flex flex-col gap-2 sm:gap-3">
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                        <Badge variant="secondary" className={`${getActionColor(activity.action)} transition-colors text-xs sm:text-sm`}>
                            {activity.action}
                        </Badge>
                        <Badge variant="secondary" className={`${getEntityColor(activity.entity)} transition-colors text-xs sm:text-sm`}>
                            {activity.entity}
                        </Badge>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                        <span className="text-muted-foreground">{activity.userEmail}</span>
                        <span className="hidden sm:inline text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{format(activity.timestamp, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}</span>
                    </div>
                    <p className="text-sm sm:text-base">{activity.details}</p>
                </div>
            </motion.div>
        </motion.div>
    );
});

AuditLogItem.displayName = 'AuditLogItem';

export default AuditLogItem; 