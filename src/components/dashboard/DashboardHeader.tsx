import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

interface DashboardHeaderProps {
    onAddTask: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    onAddTask
}) => {
    const { t } = useLanguage();

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 relative"
        >
            <div className="space-y-1 relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-lg blur opacity-50" />
                <div className="relative">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                        {t.dashboard.title}
                    </h1>
                    <p className="text-muted-foreground text-sm sm:text-base">{t.dashboard.description}</p>
                </div>
            </div>
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Button
                    onClick={onAddTask}
                    className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 transition-all duration-300 shadow-lg hover:shadow-primary/25"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    {t.dashboard.addTask}
                </Button>
            </motion.div>
        </motion.div>
    );
}; 