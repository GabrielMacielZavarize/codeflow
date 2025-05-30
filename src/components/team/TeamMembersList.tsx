import React from 'react';
import { TeamMemberCard } from '@/components/TeamMemberCard';
import { MembroEquipe } from '@/lib/firebase/membros';
import { Tarefa } from '@/lib/firebase/tarefas';

interface TeamMembersListProps {
    members: MembroEquipe[];
    tasks: Tarefa[];
    isLoading: boolean;
    onDeleteMember: (id: string) => Promise<void>;
    onUpdateMember: (id: string, dados: Partial<MembroEquipe>) => Promise<void>;
}

export const TeamMembersList: React.FC<TeamMembersListProps> = ({
    members,
    tasks,
    isLoading,
    onDeleteMember,
    onUpdateMember
}) => {
    if (isLoading) {
        return (
            <div className="col-span-full text-center py-8">
                <p className="text-gray-500">Carregando membros da equipe...</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((member) => (
                <TeamMemberCard
                    key={member.id}
                    member={member}
                    tasks={tasks}
                    onDelete={onDeleteMember}
                    onUpdate={onUpdateMember}
                />
            ))}
        </div>
    );
}; 