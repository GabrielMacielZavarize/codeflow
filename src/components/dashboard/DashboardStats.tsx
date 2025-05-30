import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowUpRight, ArrowDownRight, CheckCircle2, AlertCircle, Clock, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

interface DashboardStatsProps {
    stats: {
        totalTasks: number;
        completedTasks: number;
        pendingTasks: number;
        inProgressTasks: number;
        completionRate: number;
        averageTasksPerMember: number;
        tasksByPriority: {
            alta: number;
            media: number;
            baixa: number;
        };
        tasksByStatus: {
            pendente: number;
            em_progresso: number;
            concluida: number;
            duvida: number;
        };
    };
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
    const { t } = useLanguage();

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
            <motion.div variants={item}>
                <Card className="bg-gradient-to-br from-background to-muted/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t.dashboard.stats.totalTasks}
                        </CardTitle>
                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                        >
                            <BarChart3 className="h-4 w-4 text-primary" />
                        </motion.div>
                    </CardHeader>
                    <CardContent>
                        <motion.div 
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                            className="text-2xl font-bold"
                        >
                            {stats.totalTasks}
                        </motion.div>
                        <Progress value={stats.completionRate} className="mt-2 h-1.5" />
                        <p className="text-xs text-muted-foreground mt-2">
                            {stats.completionRate.toFixed(1)}% {t.dashboard.stats.completed}
                        </p>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={item}>
                <Card className="bg-gradient-to-br from-background to-muted/50 hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t.dashboard.stats.pendingTasks}
                        </CardTitle>
                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Clock className="h-4 w-4 text-yellow-500" />
                        </motion.div>
                    </CardHeader>
                    <CardContent>
                        <motion.div 
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                            className="text-2xl font-bold"
                        >
                            {stats.pendingTasks}
                        </motion.div>
                        <p className="text-xs text-muted-foreground">
                            {((stats.pendingTasks / stats.totalTasks) * 100).toFixed(1)}% {t.dashboard.stats.ofTotal}
                        </p>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={item}>
                <Card className="bg-gradient-to-br from-background to-muted/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t.dashboard.stats.inProgress}
                        </CardTitle>
                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                        >
                            <AlertCircle className="h-4 w-4 text-blue-500" />
                        </motion.div>
                    </CardHeader>
                    <CardContent>
                        <motion.div 
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                            className="text-2xl font-bold"
                        >
                            {stats.inProgressTasks}
                        </motion.div>
                        <p className="text-xs text-muted-foreground">
                            {((stats.inProgressTasks / stats.totalTasks) * 100).toFixed(1)}% {t.dashboard.stats.ofTotal}
                        </p>
                    </CardContent>
                </Card>
            </motion.div>

            <motion.div variants={item}>
                <Card className="bg-gradient-to-br from-background to-muted/50 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t.dashboard.stats.completedTasks}
                        </CardTitle>
                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                        >
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </motion.div>
                    </CardHeader>
                    <CardContent>
                        <motion.div 
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                            className="text-2xl font-bold"
                        >
                            {stats.completedTasks}
                        </motion.div>
                        <p className="text-xs text-muted-foreground">
                            {((stats.completedTasks / stats.totalTasks) * 100).toFixed(1)}% {t.dashboard.stats.ofTotal}
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}; 