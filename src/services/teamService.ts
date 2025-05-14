
// Interface para membros da equipe
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  tasks?: number;
  joinedAt: Date;
}

// Mock de membros da equipe
const mockTeamMembers: TeamMember[] = [
  {
    id: 'user-1',
    name: 'Ana Silva',
    email: 'ana.silva@codeflow.com',
    role: 'Desenvolvedora Frontend',
    avatar: 'https://i.pravatar.cc/150?img=1',
    tasks: 8,
    joinedAt: new Date(2023, 2, 15)
  },
  {
    id: 'user-2',
    name: 'Carlos Mendes',
    email: 'carlos.mendes@codeflow.com',
    role: 'Desenvolvedor Backend',
    avatar: 'https://i.pravatar.cc/150?img=3',
    tasks: 12,
    joinedAt: new Date(2023, 0, 10)
  },
  {
    id: 'user-3',
    name: 'Juliana Costa',
    email: 'juliana.costa@codeflow.com',
    role: 'UX/UI Designer',
    avatar: 'https://i.pravatar.cc/150?img=5',
    tasks: 5,
    joinedAt: new Date(2023, 4, 22)
  },
  {
    id: 'user-4',
    name: 'Rafael Almeida',
    email: 'rafael.almeida@codeflow.com',
    role: 'DevOps Engineer',
    avatar: 'https://i.pravatar.cc/150?img=7',
    tasks: 6,
    joinedAt: new Date(2023, 3, 5)
  }
];

// Funções para gerenciar equipe
export const getTeamMembers = async (): Promise<TeamMember[]> => {
  // Versão mock para desenvolvimento
  return mockTeamMembers;
};

export const getTeamMemberById = async (id: string): Promise<TeamMember | null> => {
  const member = mockTeamMembers.find(m => m.id === id);
  return member || null;
};

export const addTeamMember = async (member: Omit<TeamMember, 'id'>): Promise<TeamMember> => {
  const newMember = {
    ...member,
    id: `user-${mockTeamMembers.length + 1}`,
    tasks: 0
  };
  
  console.log('Membro adicionado (mock):', newMember);
  return newMember;
};

export const updateTeamMember = async (id: string, data: Partial<TeamMember>): Promise<boolean> => {
  console.log(`Membro ${id} atualizado (mock):`, data);
  return true;
};

export const deleteTeamMember = async (id: string): Promise<boolean> => {
  console.log(`Membro ${id} removido (mock)`);
  return true;
};
