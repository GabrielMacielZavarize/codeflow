import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { MembroEquipe } from '@/lib/firebase/membros';
import { Tarefa } from '@/lib/firebase/tarefas';
import TeamMemberModal from '@/components/TeamMemberModal';
import { EditMemberModal } from './EditMemberModal';

interface TeamMemberCardProps {
    member: MembroEquipe;
    tasks: Tarefa[];
    onDelete: (id: string) => void;
    onUpdate: (id: string, dados: Partial<MembroEquipe>) => void;
}

// Função utilitária para extrair o username do GitHub
function extrairUsernameGithub(url: string) {
    if (!url) return '';
    // Remove o .png do final se existir
    const urlSemExtensao = url.replace('.png', '');
    // Extrai o username do GitHub
    const match = urlSemExtensao.match(/github\.com\/([^\/]+)/);
    return match ? match[1] : '';
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, tasks, onDelete, onUpdate }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const tarefasDoMembro = tasks.filter(task => task.responsavelId === member.id);
    const tarefasConcluidas = tarefasDoMembro.filter(task => task.status === 'concluida').length;
    const progresso = tarefasDoMembro.length > 0 ? (tarefasConcluidas / tarefasDoMembro.length) * 100 : 0;

    const handleClick = () => {
        setIsModalOpen(true);
    };

    // Determina a URL do avatar
    const avatarUrl = member.avatar?.startsWith('https://')
        ? member.avatar
        : `https://unavatar.io/github/${member.avatar}`;

    return (
        <>
            <Card className="w-full">
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={avatarUrl} />
                                <AvatarFallback>{member.nome[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="text-lg font-semibold">{member.nome}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{member.cargo}</p>
                                <div className="mt-1 flex items-center space-x-2">
                                    <Badge variant="outline">{member.status}</Badge>
                                    <Badge variant="secondary">{member.tarefas} tarefas</Badge>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-start">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsEditModalOpen(true)}
                                className="h-9 w-9"
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onDelete(member.id)}
                                className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    {member.bio && (
                        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">{member.bio}</p>
                    )}
                    {member.habilidades && member.habilidades.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {member.habilidades.map((habilidade, index) => (
                                <Badge key={index} variant="secondary">
                                    {habilidade}
                                </Badge>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <TeamMemberModal
                member={isModalOpen ? member : null}
                onClose={() => setIsModalOpen(false)}
                tasks={tarefasDoMembro}
            />

            <EditMemberModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                member={member}
                onUpdate={onUpdate}
            />
        </>
    );
}; 