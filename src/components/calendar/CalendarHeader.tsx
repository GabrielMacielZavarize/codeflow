import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CalendarHeaderProps {
    currentDate: Date;
    onPreviousMonth: () => void;
    onNextMonth: () => void;
    onAddTask: () => void;
}

const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
};

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
    currentDate,
    onPreviousMonth,
    onNextMonth,
    onAddTask,
}) => {
    return (
        <CardHeader className="p-3 sm:p-6 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 dark:from-primary/10 dark:via-primary/20 dark:to-primary/10">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4"
            >
                <motion.div variants={itemVariants} className="flex items-center gap-2 sm:gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onPreviousMonth}
                        className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg transition-all duration-300"
                    >
                        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                    <div className="text-center">
                        <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            {format(currentDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onNextMonth}
                        className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg transition-all duration-300"
                    >
                        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Button
                        onClick={onAddTask}
                        className={cn(
                            "h-8 sm:h-10 px-3 sm:px-4 rounded-full",
                            "bg-primary hover:bg-primary/90",
                            "text-white font-medium text-sm sm:text-base",
                            "shadow-lg hover:shadow-xl",
                            "transition-all duration-300",
                            "flex items-center gap-1.5 sm:gap-2"
                        )}
                    >
                        <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span>Nova Tarefa</span>
                    </Button>
                </motion.div>
            </motion.div>
        </CardHeader>
    );
}; 