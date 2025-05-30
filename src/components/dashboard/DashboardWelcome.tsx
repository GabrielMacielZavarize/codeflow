import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock, Calendar, Sparkles } from 'lucide-react';

interface DashboardWelcomeProps {
    userName: string;
    stats: {
        totalTasks: number;
        inProgressTasks: number;
        completedTasks: number;
    };
}

export const DashboardWelcome: React.FC<DashboardWelcomeProps> = ({
    userName,
    stats
}) => {
    const currentTime = new Date();
    const hour = currentTime.getHours();
    const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative mb-4 sm:mb-8"
        >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 rounded-lg blur opacity-50" />
            <div className="relative bg-card rounded-lg p-4 sm:p-8 border">
                <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                            className="p-2 sm:p-3 rounded-full bg-primary/10"
                        >
                            <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                        </motion.div>
                        <div className="space-y-1">
                            <motion.h2
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500"
                            >
                                {greeting}, {userName}!
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2"
                            >
                                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                                {format(currentTime, "EEEE, d 'de' MMMM", { locale: ptBR })}
                            </motion.p>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 border border-primary/10"
                    >
                        <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0" />
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            Hoje você tem <span className="font-medium text-primary">{stats.totalTasks} tarefas</span> no total,
                            com <span className="font-medium text-blue-500">{stats.inProgressTasks} em progresso</span> e
                            <span className="font-medium text-green-500"> {stats.completedTasks} concluídas</span>.
                            Continue assim! 🚀
                        </p>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}; 