import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface TeamHeaderProps {
    onAddMember: () => void;
}

export const TeamHeader: React.FC<TeamHeaderProps> = ({ onAddMember }) => {
    const { t } = useLanguage();

    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold dark:text-white animate-slide-up">{t.team.title}</h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2 animate-slide-up delay-100">
                    {t.team.description}
                </p>
            </div>
            <Button
                onClick={onAddMember}
                className="w-full sm:w-auto flex items-center justify-center gap-2 animate-slide-up delay-200"
            >
                <Plus className="h-4 w-4" />
                {t.team.addMember}
            </Button>
        </div>
    );
}; 