import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TeamMemberCard from './TeamMemberCard';
import { MembroEquipe } from '@/lib/firebase/membros';
import { Tarefa } from '@/lib/firebase/tarefas';

interface TeamSectionProps {
    members: MembroEquipe[];
    tasks: Tarefa[];
}

const TeamSection: React.FC<TeamSectionProps> = ({ members, tasks }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Equipe</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {members.map((member) => (
                        <TeamMemberCard key={member.id} member={member} tasks={tasks} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default TeamSection; 