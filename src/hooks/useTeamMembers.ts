import { useState, useEffect } from 'react';
import { MembroEquipe } from '@/lib/firebase/membros';
import { membrosService } from '@/lib/firebase/membros';
import { toast } from '@/components/ui/sonner';

export const useTeamMembers = () => {
    const [members, setMembers] = useState<MembroEquipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadMembers = async () => {
            try {
                const membros = await membrosService.buscarMembros();
                setMembers(membros);
                setLoading(false);
            } catch (err) {
                setError('Erro ao carregar membros');
                toast.error('Erro ao carregar membros da equipe');
                setLoading(false);
            }
        };

        loadMembers();
    }, []);

    const addMember = async (member: Omit<MembroEquipe, 'id'>) => {
        try {
            const newMember = await membrosService.adicionarMembro(member);
            setMembers(prev => [...prev, newMember]);
            toast.success('Membro adicionado com sucesso!');
            return newMember;
        } catch (err) {
            setError('Erro ao adicionar membro');
            toast.error('Erro ao adicionar membro');
            throw err;
        }
    };

    const updateMember = async (id: string, updates: Partial<MembroEquipe>) => {
        try {
            await membrosService.atualizarMembro(id, updates);
            setMembers(prev => prev.map(member =>
                member.id === id ? { ...member, ...updates } : member
            ));
            toast.success('Membro atualizado com sucesso!');
        } catch (err) {
            setError('Erro ao atualizar membro');
            toast.error('Erro ao atualizar membro');
            throw err;
        }
    };

    const deleteMember = async (id: string) => {
        try {
            await membrosService.removerMembro(id);
            setMembers(prev => prev.filter(member => member.id !== id));
            toast.success('Membro removido com sucesso!');
        } catch (err) {
            setError('Erro ao remover membro');
            toast.error('Erro ao remover membro');
            throw err;
        }
    };

    const getMemberById = (id: string) => {
        return members.find(member => member.id === id);
    };

    const getNewMembers = () => {
        return members.filter(member => member.isNew);
    };

    return {
        members,
        loading,
        error,
        addMember,
        updateMember,
        deleteMember,
        getMemberById,
        getNewMembers
    };
}; 