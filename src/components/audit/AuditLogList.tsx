import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AuditLogItem from './AuditLogItem';
import { History } from 'lucide-react';

interface AuditLogListProps {
    activities: Array<{
        id: string;
        action: string;
        entity: string;
        entityId?: string;
        userEmail: string;
        details: string;
        timestamp: Date;
    }>;
    isLoading: boolean;
    translations: {
        activityHistory: string;
        activityDescription: string;
        loading: string;
        noActivities: string;
    };
}

export const AuditLogList: React.FC<AuditLogListProps> = ({
    activities,
    isLoading,
    translations
}) => {
    return (
        <Card className="bg-gradient-to-br from-background via-background/95 to-muted/30 backdrop-blur-sm border border-primary/10 shadow-2xl">
            <CardHeader className="border-b border-primary/10 p-3 sm:p-6">
                <div className="flex items-center gap-2">
                    <History className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    <CardTitle className="text-lg sm:text-xl">{translations.activityHistory}</CardTitle>
                </div>
                <CardDescription className="text-sm">{translations.activityDescription}</CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
                {isLoading ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-center items-center py-8 sm:py-12"
                    >
                        <div className="h-6 w-6 sm:h-8 sm:w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                        <span className="ml-3 text-sm sm:text-base text-muted-foreground">{translations.loading}</span>
                    </motion.div>
                ) : (
                    <div className="relative">
                        <div className="absolute left-3 sm:left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary/10 to-transparent"></div>
                        <div className="space-y-3 sm:space-y-4 pl-6 sm:pl-8">
                            <AnimatePresence mode="popLayout">
                                {activities.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="text-center py-8 sm:py-12"
                                    >
                                        <p className="text-sm sm:text-base text-muted-foreground">{translations.noActivities}</p>
                                    </motion.div>
                                ) : (
                                    activities.map((activity, index) => (
                                        <AuditLogItem
                                            key={activity.id}
                                            activity={activity}
                                            index={index}
                                        />
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}; 