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
import { CalendarIcon, Plus, AlertCircle, Clock, CheckCircle2, HelpCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tarefa } from '@/lib/firebase/tarefas';
import { MembroEquipe } from '@/lib/firebase/membros';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

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
        titulo: formData.titulo.trim(),
        descricao: formData.descricao.trim(),
        concluida: false,
        userId: currentUser.uid,
        userEmail: currentUser.email || '',
        dataInicio: new Date(formData.dataInicio),
        dataFim: formData.dataFim ? new Date(formData.dataFim) : null,
        responsavelId: formData.responsavelId || currentUser.uid,
        responsavelNome: membroResponsavel?.nome || currentUser.displayName || currentUser.email || 'Usuário',
        responsavelAvatar: membroResponsavel?.avatar || `https://unavatar.io/github/${membroResponsavel?.nome || currentUser.displayName}`,
        prioridade: formData.prioridade,
        status: formData.status
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
        className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-background via-background/95 to-muted/30 backdrop-blur-sm border border-primary/10 shadow-2xl"
      >
        <VisuallyHidden>
          <DialogTitle>Nova Tarefa</DialogTitle>
          <DialogDescription>
            Preencha os detalhes abaixo para criar uma nova tarefa
          </DialogDescription>
        </VisuallyHidden>

        <DialogHeader className="space-y-4 pb-6 border-b border-primary/10">
          <div className="text-2xl font-bold flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 shadow-lg shadow-primary/10">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            Nova Tarefa
          </div>
          <p className="mt-3 text-muted-foreground/80">
            Preencha os detalhes abaixo para criar uma nova tarefa
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8 pt-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2.5">
              <Label htmlFor="titulo" className="text-sm font-medium text-foreground/90">Título</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Digite o título da tarefa"
                required
                className="w-full bg-background/50 border-primary/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="responsavel" className="text-sm font-medium text-foreground/90">Responsável</Label>
              <Select value={formData.responsavelId} onValueChange={(value) => setFormData({ ...formData, responsavelId: value })}>
                <SelectTrigger id="responsavel" className="w-full bg-background/50 border-primary/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200">
                  <SelectValue placeholder="Selecione um responsável" />
                </SelectTrigger>
                <SelectContent className="bg-background/95 backdrop-blur-sm border-primary/10">
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id} className="focus:bg-primary/10">
                      {member.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="descricao" className="text-sm font-medium text-foreground/90">Descrição</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Descreva os detalhes da tarefa"
              className="min-h-[120px] bg-background/50 border-primary/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2.5">
              <Label className="text-sm font-medium text-foreground/90">Prioridade</Label>
              <Select value={formData.prioridade} onValueChange={(value) => setFormData({ ...formData, prioridade: value })}>
                <SelectTrigger className="w-full bg-background/50 border-primary/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200">
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent className="bg-background/95 backdrop-blur-sm border-primary/10">
                  <SelectItem value="alta" className="text-red-500 focus:bg-red-500/10">
                    Alta Prioridade
                  </SelectItem>
                  <SelectItem value="media" className="text-yellow-500 focus:bg-yellow-500/10">
                    Média Prioridade
                  </SelectItem>
                  <SelectItem value="baixa" className="text-green-500 focus:bg-green-500/10">
                    Baixa Prioridade
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2.5">
              <Label className="text-sm font-medium text-foreground/90">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="w-full bg-background/50 border-primary/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent className="bg-background/95 backdrop-blur-sm border-primary/10">
                  <SelectItem value="pendente">
                    <div className="flex items-center gap-2.5">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      <span>Pendente</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="em_progresso">
                    <div className="flex items-center gap-2.5">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span>Em Progresso</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="concluida">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Concluída</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="duvida">
                    <div className="flex items-center gap-2.5">
                      <HelpCircle className="h-4 w-4 text-orange-500" />
                      <span>Com Dúvida</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2.5">
              <Label className="text-sm font-medium text-foreground/90">Data de Início</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-background/50 border-primary/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200",
                      !formData.dataInicio && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dataInicio ? format(new Date(formData.dataInicio), "PPP", { locale: ptBR }) : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-background/95 backdrop-blur-sm border-primary/10">
                  <Calendar
                    mode="single"
                    selected={new Date(formData.dataInicio)}
                    onSelect={(date) => {
                      if (date) {
                        // Ajusta a data para o início do dia no fuso horário local
                        const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                        setFormData({ ...formData, dataInicio: localDate.toISOString() });
                      }
                    }}
                    initialFocus
                    disabled={(date) => false} // Permite selecionar qualquer data
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2.5">
              <Label className="text-sm font-medium text-foreground/90">Data de Término</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-background/50 border-primary/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200",
                      !formData.dataFim && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dataFim ? format(new Date(formData.dataFim), "PPP", { locale: ptBR }) : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-background/95 backdrop-blur-sm border-primary/10">
                  <Calendar
                    mode="single"
                    selected={formData.dataFim ? new Date(formData.dataFim) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        // Ajusta a data para o início do dia no fuso horário local
                        const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                        setFormData({ ...formData, dataFim: localDate.toISOString() });
                      }
                    }}
                    initialFocus
                    disabled={(date) => false} // Permite selecionar qualquer data
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-primary/10">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="hover:bg-muted/50 transition-colors"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 transition-all duration-300 shadow-lg hover:shadow-primary/25"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Criar Tarefa
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
