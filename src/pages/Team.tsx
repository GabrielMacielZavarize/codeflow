
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { TeamMember, getTeamMembers, addTeamMember } from '../services/teamService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { UserPlus, Users } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR'; 
import { enUS } from 'date-fns/locale/en-US';
import { es } from 'date-fns/locale/es';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '../contexts/LanguageContext';

const Team = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: ''
  });
  
  useEffect(() => {
    const loadTeamMembers = async () => {
      setIsLoading(true);
      try {
        const members = await getTeamMembers();
        setTeamMembers(members);
      } catch (error) {
        console.error('Erro ao carregar membros da equipe:', error);
        toast({
          title: t.general.error,
          description: t.team.errorAdding,
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTeamMembers();
  }, [toast, t]);
  
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMember.name || !newMember.email || !newMember.role) {
      toast({
        title: t.general.error,
        description: t.team.incompleteData,
        variant: 'destructive'
      });
      return;
    }
    
    try {
      const memberToAdd = {
        ...newMember,
        joinedAt: new Date()
      };
      
      const addedMember = await addTeamMember(memberToAdd);
      
      setTeamMembers([...teamMembers, addedMember]);
      setNewMember({ name: '', email: '', role: '' });
      setIsAddMemberDialogOpen(false);
      
      toast({
        title: t.team.memberAdded,
        description: `${addedMember.name} ${t.team.memberAdded}.`
      });
    } catch (error) {
      console.error('Erro ao adicionar membro:', error);
      toast({
        title: t.general.error,
        description: t.team.errorAdding,
        variant: 'destructive'
      });
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Get the correct locale for date formatting based on selected language
  const getLocale = () => {
    switch(language) {
      case 'es': 
        return es;
      case 'en-US': 
        return enUS;
      case 'pt-BR':
      default: 
        return ptBR;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t.team.title}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t.team.description}
          </p>
        </div>
        <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              {t.team.addMember}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.team.addMemberTitle}</DialogTitle>
              <DialogDescription>
                {t.team.addMemberDescription}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleAddMember} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t.team.fullName}</Label>
                <Input
                  id="name"
                  placeholder="Ex: João Silva"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">{t.team.email}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Ex: joao.silva@exemplo.com"
                  value={newMember.email}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">{t.team.role}</Label>
                <Input
                  id="role"
                  placeholder="Ex: Desenvolvedor Frontend"
                  value={newMember.role}
                  onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                  required
                />
              </div>
              
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setIsAddMemberDialogOpen(false)}>
                  {t.team.cancel}
                </Button>
                <Button type="submit">{t.team.add}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t.team.totalMembers}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{teamMembers.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t.team.assignedTasks}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {teamMembers.reduce((sum, member) => sum + (member.tasks || 0), 0)}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <span className="ml-3 dark:text-gray-300">{t.general.loading}</span>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{t.team.teamMembers}</CardTitle>
            <CardDescription>
              {t.team.teamMembersList}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.team.member}</TableHead>
                  <TableHead>{t.team.role}</TableHead>
                  <TableHead>{t.team.email}</TableHead>
                  <TableHead>{t.team.tasks}</TableHead>
                  <TableHead>{t.team.since}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map(member => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{member.tasks || 0}</Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(member.joinedAt), 'PP', { locale: getLocale() })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Team;
