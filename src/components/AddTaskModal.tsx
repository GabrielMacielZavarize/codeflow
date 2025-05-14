import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { addTask, Priority, Task } from '../services/taskService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useLanguage } from '../contexts/LanguageContext';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskAdded: (task: Task) => void;
  initialDate?: Date | null;
  teamMembers?: Array<{
    id: number;
    name: string;
    role: string;
  }>;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onTaskAdded,
  initialDate,
  teamMembers = [
    { id: 1, name: 'user-1', role: 'Desenvolvedor' },
    { id: 2, name: 'user-2', role: 'Designer' },
    { id: 3, name: 'user-3', role: 'Gerente' },
    { id: 4, name: 'user-4', role: 'Analista' }
  ]
}) => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState<Date | undefined>(initialDate);
  const [assignee, setAssignee] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error(t.tasks.error);
      return;
    }

    if (!title.trim()) {
      toast.error(t.tasks.titleRequired);
      return;
    }

    const newTask = {
      title: title.trim(),
      description: description.trim(),
      priority,
      createdAt: new Date(),
      userId: currentUser.uid,
      dueDate,
      assignee,
      status: 'pending',
      progress: 0
    };

    setIsSubmitting(true);
    const addedTask = await addTask(newTask);
    setIsSubmitting(false);

    if (addedTask) {
      toast.success(t.tasks.added);
      onTaskAdded(addedTask);
      resetForm();
      onClose();
    } else {
      toast.error(t.tasks.addError);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate(undefined);
    setAssignee('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-4 sm:p-6">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="sm:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <DialogTitle className="text-xl sm:text-2xl">{t.tasks.addTask}</DialogTitle>
          </div>
          <DialogDescription className="text-sm sm:text-base">
            {t.tasks.addTaskDescription}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm sm:text-base">{t.tasks.titleLabel}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.tasks.titlePlaceholder}
              required
              className="text-sm sm:text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm sm:text-base">{t.tasks.descriptionLabel}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.tasks.descriptionPlaceholder}
              rows={3}
              className="text-sm sm:text-base"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm sm:text-base">{t.tasks.priorityLabel}</Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
                <SelectTrigger className="text-sm sm:text-base">
                  <SelectValue placeholder={t.tasks.selectPriority} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">{t.tasks.priority.high}</SelectItem>
                  <SelectItem value="medium">{t.tasks.priority.medium}</SelectItem>
                  <SelectItem value="low">{t.tasks.priority.low}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignee" className="text-sm sm:text-base">{t.tasks.assignLabel}</Label>
              <Select value={assignee} onValueChange={setAssignee}>
                <SelectTrigger className="text-sm sm:text-base">
                  <SelectValue placeholder={t.tasks.selectAssignee} />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.name} className="text-sm sm:text-base">
                      {member.name} - {member.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm sm:text-base">{t.tasks.dueDate}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal text-sm sm:text-base"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, 'PPP', { locale: ptBR }) : t.tasks.selectDate}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onClose();
              }}
              disabled={isSubmitting}
              className="w-full sm:w-auto text-sm sm:text-base"
            >
              {t.tasks.cancel}
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto text-sm sm:text-base"
            >
              {isSubmitting ? t.tasks.adding : t.tasks.addTask}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;
