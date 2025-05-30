import React from 'react';
import { CardContent } from '@/components/ui/card';
import { CalendarDay } from './CalendarDay';
import { Task } from '@/services/taskService';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CalendarGridProps {
    daysInMonth: Date[];
    dayOfWeek: number;
    getTasksForDay: (day: Date) => Task[];
    onDayClick: (day: Date) => void;
    onTaskClick: (taskId: string) => void;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
};

const dayVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export const CalendarGrid: React.FC<CalendarGridProps> = ({
    daysInMonth,
    dayOfWeek,
    getTasksForDay,
    onDayClick,
    onTaskClick,
}) => {
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    return (
        <CardContent className="p-2 sm:p-4">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-7 gap-1 sm:gap-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-2 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg"
            >
                {/* Cabeçalho dos dias da semana */}
                {dayNames.map((dayName) => (
                    <motion.div
                        key={dayName}
                        variants={dayVariants}
                        className={cn(
                            "text-center py-1 sm:py-2 font-semibold text-xs sm:text-sm",
                            "text-gray-600 dark:text-gray-400",
                            "bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm",
                            "rounded-lg shadow-sm"
                        )}
                    >
                        {dayName}
                    </motion.div>
                ))}

                {/* Células vazias para dias antes do início do mês */}
                {Array.from({ length: dayOfWeek }).map((_, index) => (
                    <motion.div
                        key={`empty-${index}`}
                        variants={dayVariants}
                        className={cn(
                            "min-h-[100px] sm:min-h-[160px] rounded-lg sm:rounded-xl",
                            "bg-gray-50/50 dark:bg-gray-800/50",
                            "border border-dashed border-gray-200 dark:border-gray-700"
                        )}
                    />
                ))}

                {/* Dias do mês */}
                {daysInMonth.map((day) => (
                    <motion.div
                        key={day.toISOString()}
                        variants={dayVariants}
                    >
                        <CalendarDay
                            day={day}
                            tasks={getTasksForDay(day)}
                            onDayClick={onDayClick}
                            onTaskClick={onTaskClick}
                        />
                    </motion.div>
                ))}
            </motion.div>
        </CardContent>
    );
}; 