import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Plus, AlertCircle, Clock, CheckCircle2, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tarefa } from '@/lib/firebase/tarefas';
import { MembroEquipe } from '@/lib/firebase/membros';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskAdded: (task: any) => Promise<boolean>;
  teamMembers: MembroEquipe[];
  selectedDate?: Date | null;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onTaskAdded,
  teamMembers,
  selectedDate
}) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    prioridade: 'media',
    status: 'pendente',
    responsavelId: '',
    dataInicio: new Date().toISOString().split('T')[0],
    dataFim: ''
  });

  useEffect(() => {
    if (isOpen) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error('Usuário não autenticado');
      return;
    }

    try {
      const membroResponsavel = teamMembers.find(member => member.id === formData.responsavelId);
      const novaTarefa = {
        ...formData,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        dataInicio: new Date(formData.dataInicio),
        dataFim: formData.dataFim ? new Date(formData.dataFim) : null,
        responsavelId: formData.responsavelId || currentUser.uid,
        responsavelNome: membroResponsavel?.nome || currentUser.displayName || currentUser.email || 'Usuário',
        responsavelAvatar: membroResponsavel?.avatar || `https://unavatar.io/github/${membroResponsavel?.nome || currentUser.displayName}`
      };

      const taskAdded = await onTaskAdded(novaTarefa);

      if (taskAdded) {
        toast.success('Tarefa criada com sucesso!');
        onClose();
        setFormData({
          titulo: '',
          descricao: '',
          prioridade: 'media',
          status: 'pendente',
          responsavelId: '',
          dataInicio: new Date().toISOString().split('T')[0],
          dataFim: ''
        });
      }
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      toast.error('Erro ao criar tarefa. Tente novamente.');
    }
  };

  const handleClose = () => {
    setFormData({
      titulo: '',
      descricao: '',
      prioridade: 'media',
      status: 'pendente',
      responsavelId: '',
      dataInicio: new Date().toISOString().split('T')[0],
      dataFim: ''
    });
    onClose();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'concluida':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'em_progresso':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'pendente':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'duvida':
        return <HelpCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
        aria-describedby="dialog-description"
      >
        <DialogHeader>
          <DialogTitle id="dialog-title" className="text-2xl font-bold flex items-center gap-2">
            <Plus className="h-6 w-6 text-primary" />
            Nova Tarefa
          </DialogTitle>
          <DialogDescription id="dialog-description">
            Preencha os detalhes abaixo para criar uma nova tarefa
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6" aria-labelledby="dialog-title">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Digite o título da tarefa"
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsavel">Responsável</Label>
              <Select value={formData.responsavelId} onValueChange={(value) => setFormData({ ...formData, responsavelId: value })}>
                <SelectTrigger id="responsavel" className="w-full">
                  <SelectValue placeholder="Selecione um responsável" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Descreva os detalhes da tarefa"
              className="min-h-[100px]"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select value={formData.prioridade} onValueChange={(value) => setFormData({ ...formData, prioridade: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alta" className="text-red-500">
                    Alta Prioridade
                  </SelectItem>
                  <SelectItem value="media" className="text-yellow-500">
                    Média Prioridade
                  </SelectItem>
                  <SelectItem value="baixa" className="text-green-500">
                    Baixa Prioridade
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente" className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    Pendente
                  </SelectItem>
                  <SelectItem value="em_progresso" className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    Em Progresso
                  </SelectItem>
                  <SelectItem value="concluida" className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Concluída
                  </SelectItem>
                  <SelectItem value="duvida" className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-orange-500" />
                    Com Dúvida
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Data de Início</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dataInicio && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dataInicio ? format(new Date(formData.dataInicio), "PPP", { locale: ptBR }) : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={new Date(formData.dataInicio)}
                    onSelect={(date) => setFormData({ ...formData, dataInicio: date?.toISOString().split('T')[0] || '' })}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Data de Término</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dataFim && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dataFim ? format(new Date(formData.dataFim), "PPP", { locale: ptBR }) : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.dataFim ? new Date(formData.dataFim) : undefined}
                    onSelect={(date) => setFormData({ ...formData, dataFim: date?.toISOString().split('T')[0] || '' })}
                    initialFocus
                    locale={ptBR}
                    disabled={(date) => date < (new Date(formData.dataInicio) || new Date())}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90"
            >
              Criar Tarefa
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
