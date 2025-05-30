import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Briefcase, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface TeamStatsProps {
    totalMembers: number;
    assignedTasks: number;
}

export const TeamStats: React.FC<TeamStatsProps> = ({ totalMembers, assignedTasks }) => {
    const { t } = useLanguage();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
                <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">{t.team.totalMembers}</p>
                            <h3 className="text-xl sm:text-2xl font-bold mt-1">{totalMembers}</h3>
                        </div>
                        <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">{t.team.assignedTasks}</p>
                            <h3 className="text-xl sm:text-2xl font-bold mt-1">{assignedTasks}</h3>
                        </div>
                        <Briefcase className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
                    </div>
                </CardContent>
            </Card>

            <Card className="sm:col-span-2 lg:col-span-1">
                <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">{t.team.teamMembers}</p>
                            <h3 className="text-xl sm:text-2xl font-bold mt-1">{totalMembers}</h3>
                        </div>
                        <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}; 