import React from 'react';
import { format, isToday } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/services/taskService';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CalendarDayProps {
    day: Date;
    tasks: Task[];
    onDayClick: (day: Date) => void;
    onTaskClick: (taskId: string) => void;
}

export const CalendarDay: React.FC<CalendarDayProps> = ({
    day,
    tasks,
    onDayClick,
    onTaskClick,
}) => {
    const getTaskStyle = (prioridade: string) => {
        switch (prioridade) {
            case 'alta':
                return "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700";
            case 'media':
                return "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700";
            case 'baixa':
                return "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700";
            default:
                return "bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className={cn(
                "relative p-1.5 sm:p-3 min-h-[100px] sm:min-h-[160px] border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl",
                "transition-all duration-300 ease-in-out",
                "hover:shadow-lg hover:scale-[1.02] hover:z-10",
                "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm",
                isToday(day) && "ring-2 ring-primary shadow-md bg-primary/5"
            )}
            onClick={() => onDayClick(day)}
        >
            {/* Cabeçalho do dia */}
            <div className="flex justify-between items-start mb-1 sm:mb-3">
                <span className={cn(
                    "text-sm sm:text-lg font-semibold",
                    isToday(day) ? "text-primary font-bold" : "text-gray-700 dark:text-gray-300"
                )}>
                    {format(day, 'd')}
                </span>
                {tasks.length > 0 && (
                    <Badge
                        variant="secondary"
                        className="ml-1 bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-200 text-xs sm:text-sm"
                    >
                        {tasks.length}
                    </Badge>
                )}
            </div>

            {/* Lista de tarefas */}
            <div className="space-y-1 sm:space-y-2 overflow-y-auto max-h-[70px] sm:max-h-[120px] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent pr-1">
                {tasks.map((task) => (
                    <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onTaskClick(task.id);
                        }}
                        className={cn(
                            "p-1.5 sm:p-2.5 rounded-md sm:rounded-lg cursor-pointer",
                            "transition-all duration-200 ease-in-out",
                            "hover:shadow-md hover:scale-[1.02]",
                            "flex items-center gap-1.5 sm:gap-2.5",
                            "font-medium text-xs sm:text-sm",
                            getTaskStyle(task.prioridade)
                        )}
                    >
                        <div className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-white/90 flex-shrink-0" />
                        <span className="truncate flex-1">{task.titulo}</span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}; 