import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Users, UserPlus, Mail, Briefcase, Calendar, Star, Code2, Palette, ClipboardList, Bug } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Badge } from '@/components/ui/badge';

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  joinDate: Date;
  tasks: number;
  avatar: string;
  skills: string[];
  isNew: boolean;
  bio: string;
}

const Team = () => {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: ''
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Membros atuais da equipe
  const [teamMembers] = useState<TeamMember[]>([
    {
      id: 1,
      name: 'Gabriel M.',
      role: 'Desenvolvedor Frontend',
      tasks: 5,
      isNew: true,
      joinDate: new Date('2024-03-15'),
      avatar: 'https://github.com/GabrielMacielZavarize.png',
      email: 'gabrielmzavarize@gmail.com',
      bio: 'Desenvolvedor Frontend apaixonado por criar interfaces modernas e intuitivas. Especialista em React, TypeScript e UI/UX.',
      skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'UI/UX']
    },
    {
      id: 2,
      name: 'Pedro H.',
      role: 'Desenvolvedor Backend',
      tasks: 3,
      isNew: false,
      joinDate: new Date('2024-02-01'),
      avatar: 'https://github.com/PedroHarter.png',
      email: 'pedro.henrique@codeflow.com',
      bio: 'Desenvolvedor Backend com foco em arquitetura de sistemas escaláveis. Experiência em Node.js, Python e arquitetura de microsserviços.',
      skills: ['Node.js', 'Python', 'Docker', 'AWS', 'MongoDB']
    },
    {
      id: 3,
      name: 'Wilian V.',
      role: 'Designer',
      tasks: 4,
      isNew: true,
      joinDate: new Date('2024-03-10'),
      avatar: 'https://github.com/WilianVieiraF.png',
      email: 'wilian.viana@codeflow.com',
      bio: 'Designer criativo com foco em experiência do usuário e interfaces modernas. Especialista em Figma e design systems.',
      skills: ['Figma', 'UI Design', 'UX Research', 'Design Systems', 'Prototipagem']
    },
    {
      id: 4,
      name: 'Alexandre',
      role: 'Product Manager',
      tasks: 2,
      isNew: false,
      joinDate: new Date('2024-01-15'),
      avatar: 'https://github.com/xandetds.png',
      email: 'maria.silva@codeflow.com',
      bio: 'Product Manager com experiência em gestão de produtos digitais e metodologias ágeis. Foco em entregar valor ao usuário final.',
      skills: ['Product Strategy', 'Agile', 'User Research', 'Data Analysis', 'Stakeholder Management']
    },
    {
      id: 5,
      name: 'Pedro C.',
      role: 'QA Engineer',
      tasks: 6,
      isNew: false,
      joinDate: new Date('2024-02-20'),
      avatar: 'https://github.com/PedroCanto.png',
      email: 'joao.pedro@codeflow.com',
      bio: 'QA Engineer especializado em testes automatizados e garantia de qualidade. Experiência em Cypress, Jest e metodologias de teste.',
      skills: ['Testes Automatizados', 'Cypress', 'Jest', 'CI/CD', 'Qualidade de Software']
    }
  ]);

  useEffect(() => {
    const loadTeamData = async () => {
      setIsLoading(true);
      // Simular carregamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
    };

    loadTeamData();
  }, []);

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email || !newMember.role) {
      toast.error(t.team.incompleteData);
      return;
    }

    // Aqui você pode adicionar a lógica para salvar o novo membro
    toast.success(t.team.memberAdded);
    setShowAddMember(false);
    setNewMember({ name: '', email: '', role: '' });
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'desenvolvedor frontend':
        return <Code2 className="h-4 w-4" />;
      case 'desenvolvedor backend':
        return <Code2 className="h-4 w-4" />;
      case 'designer':
        return <Palette className="h-4 w-4" />;
      case 'product manager':
        return <ClipboardList className="h-4 w-4" />;
      case 'qa engineer':
        return <Bug className="h-4 w-4" />;
      default:
        return <Briefcase className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{t.general.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold dark:text-white">{t.team.title}</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">{t.team.description}</p>
        </div>
        <Button onClick={() => setShowAddMember(true)} className="w-full sm:w-auto flex items-center justify-center gap-2">
          <UserPlus className="h-4 w-4" />
          {t.team.addMember}
        </Button>
      </div>

      {/* Estatísticas da Equipe */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
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
                  {teamMembers.reduce((acc, member) => acc + member.tasks, 0)}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {teamMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-base sm:text-lg truncate">{member.name}</h3>
                    {member.isNew && (
                      <Badge variant="secondary" className="shrink-0 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        Novo
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {getRoleIcon(member.role)}
                    <span className="truncate">{member.role}</span>
                  </div>
                  <div className="mt-3 sm:mt-4">
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1 sm:mb-2">
                      {member.tasks} tarefas atribuídas
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      Entrou em {member.joinDate.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-3 sm:mt-4">
                    <p className="text-xs sm:text-sm font-medium mb-2">Habilidades:</p>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {member.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs sm:text-sm bg-gray-100 dark:bg-gray-800">
                          {skill}
                        </Badge>
                      ))}
                      {member.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs sm:text-sm bg-gray-100 dark:bg-gray-800">
                          +{member.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de Adicionar Membro */}
      <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">{t.team.addMemberTitle}</DialogTitle>
            <DialogDescription className="text-sm">{t.team.addMemberDescription}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-sm">{t.team.fullName}</Label>
              <Input
                id="name"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                className="text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-sm">{t.team.email}</Label>
              <Input
                id="email"
                type="email"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                className="text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role" className="text-sm">{t.team.role}</Label>
              <Select
                value={newMember.role}
                onValueChange={(value) => setNewMember({ ...newMember, role: value })}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder={t.team.role} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Desenvolvedor Frontend">Desenvolvedor Frontend</SelectItem>
                  <SelectItem value="Desenvolvedor Backend">Desenvolvedor Backend</SelectItem>
                  <SelectItem value="Designer">Designer</SelectItem>
                  <SelectItem value="Product Manager">Product Manager</SelectItem>
                  <SelectItem value="QA Engineer">QA Engineer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowAddMember(false)} className="w-full sm:w-auto">
              {t.team.cancel}
            </Button>
            <Button onClick={handleAddMember} className="w-full sm:w-auto">
              {t.team.add}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Team;
