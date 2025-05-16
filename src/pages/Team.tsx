import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Briefcase, Calendar, Plus, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { membrosService, MembroEquipe } from '@/lib/firebase/membros';
import { AddMemberModal } from '@/components/AddMemberModal';
import { tarefasService, Tarefa } from '@/lib/firebase/tarefas';
import { onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { TeamMemberCard } from '@/components/TeamMemberCard';
import TeamMemberModal from '@/components/TeamMemberModal';

const Team = () => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [teamMembers, setTeamMembers] = useState<MembroEquipe[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MembroEquipe | null>(null);
  const [tasks, setTasks] = useState<Tarefa[]>([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const tarefasRef = collection(db, 'tarefas');
    const q = query(tarefasRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tarefasAtualizadas = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          dataCriacao: data.dataCriacao?.toDate?.() || new Date(),
          dataAtualizacao: data.dataAtualizacao?.toDate?.() || new Date(),
          dataInicio: data.dataInicio?.toDate?.() || new Date(),
          dataFim: data.dataFim?.toDate?.() || new Date(),
          comentarios: data.comentarios?.map((comentario: any) => ({
            ...comentario,
            dataCriacao: comentario.dataCriacao?.toDate?.() || new Date(),
            respostas: comentario.respostas?.map((resposta: any) => ({
              ...resposta,
              dataCriacao: resposta.dataCriacao?.toDate?.() || new Date()
            }))
          })) || []
        };
      }) as Tarefa[];

      setTasks(tarefasAtualizadas);
    });

    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    const carregarMembros = async () => {
      try {
        setIsLoadingMembers(true);
        await membrosService.inicializarMembrosPadrao();

        // Adicionar listener em tempo real para os membros
        const membrosRef = collection(db, 'membros');
        const unsubscribe = onSnapshot(membrosRef, (snapshot) => {
          const membrosAtualizados = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            nome: doc.data().nome || 'Sem nome',
            cargo: doc.data().cargo || 'Sem cargo',
            tarefas: doc.data().tarefas || 0,
            isNew: doc.data().isNew || false,
            dataEntrada: doc.data().dataEntrada?.toDate() || new Date(),
            avatar: doc.data().avatar || `https://avatar.vercel.sh/${doc.data().nome}`,
            email: doc.data().email || '',
            bio: doc.data().bio || '',
            habilidades: doc.data().habilidades || [],
            status: doc.data().status || 'Junior'
          })) as MembroEquipe[];

          setTeamMembers(membrosAtualizados);
          setIsLoadingMembers(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Erro ao carregar membros:', error);
        setIsLoadingMembers(false);
      }
    };

    carregarMembros();
  }, []);

  const handleAddMember = async (novoMembro: Omit<MembroEquipe, 'id'>) => {
    try {
      const membro = await membrosService.adicionarMembro(novoMembro);
      setTeamMembers([...teamMembers, membro]);
      toast.success('Membro adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar membro:', error);
      toast.error('Erro ao adicionar membro');
    }
  };

  const handleDeleteMember = async (id: string) => {
    try {
      await membrosService.removerMembro(id);
      setTeamMembers(teamMembers.filter(member => member.id !== id));
      toast.success('Membro removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover membro:', error);
      toast.error('Erro ao remover membro');
    }
  };

  const handleUpdateMember = async (id: string, dados: Partial<MembroEquipe>) => {
    try {
      await membrosService.atualizarMembro(id, dados);
      setTeamMembers(teamMembers.map(membro =>
        membro.id === id ? { ...membro, ...dados } : membro
      ));
      toast.success('Membro atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar membro:', error);
      toast.error('Erro ao atualizar membro');
    }
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'Data não definida';
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) return 'Data inválida';
      return dateObj.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Data inválida';
    }
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold dark:text-white animate-slide-up">{t.team.title}</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2 animate-slide-up delay-100">{t.team.description}</p>
        </div>
        <Button onClick={() => setIsAddMemberModalOpen(true)} className="w-full sm:w-auto flex items-center justify-center gap-2 animate-slide-up delay-200">
          <Plus className="h-4 w-4" />
          {t.team.addMember}
        </Button>
      </div>

      {/* Estatísticas da Equipe */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">{t.team.totalMembers}</p>
                <h3 className="text-xl sm:text-2xl font-bold mt-1">{teamMembers.length}</h3>
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
                <h3 className="text-xl sm:text-2xl font-bold mt-1">
                  {tasks.filter(task => task.responsavelId).length}
                </h3>
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
                <h3 className="text-xl sm:text-2xl font-bold mt-1">{teamMembers.length}</h3>
              </div>
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Membros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoadingMembers ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">Carregando membros da equipe...</p>
          </div>
        ) : (
          teamMembers.map((member) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              tasks={tasks}
              onDelete={handleDeleteMember}
              onUpdate={handleUpdateMember}
            />
          ))
        )}
      </div>

      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        onMemberAdded={handleAddMember}
      />

      <TeamMemberModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
        tasks={tasks.filter(task => task.responsavelId === selectedMember?.id)}
      />
    </div>
  );
};

export default Team;
