// Interface para membros da equipe
export interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
  tasks: number;
  joinDate: Date;
  skills: string[];
  isNew: boolean;
  bio: string;
}

// Mock de membros da equipe
const mockTeamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Gabriel M.',
    role: 'Desenvolvedor Frontend',
    tasks: 5,
    isNew: true,
    joinDate: new Date('2024-03-15'),
    avatar: 'https://avatars.githubusercontent.com/u/12345678',
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
    avatar: 'https://github.com/pedrohenrique.png',
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
    avatar: 'https://avatars.githubusercontent.com/u/87654321',
    email: 'wilian.viana@codeflow.com',
    bio: 'Designer criativo com foco em experiência do usuário e interfaces modernas. Especialista em Figma e design systems.',
    skills: ['Figma', 'UI Design', 'UX Research', 'Design Systems', 'Prototipagem']
  },
  {
    id: 4,
    name: 'Maria S.',
    role: 'Product Manager',
    tasks: 2,
    isNew: false,
    joinDate: new Date('2024-01-15'),
    avatar: 'https://github.com/mariasilva.png',
    email: 'maria.silva@codeflow.com',
    bio: 'Product Manager com experiência em gestão de produtos digitais e metodologias ágeis. Foco em entregar valor ao usuário final.',
    skills: ['Product Strategy', 'Agile', 'User Research', 'Data Analysis', 'Stakeholder Management']
  },
  {
    id: 5,
    name: 'João P.',
    role: 'QA Engineer',
    tasks: 6,
    isNew: false,
    joinDate: new Date('2024-02-20'),
    avatar: 'https://github.com/joaopedro.png',
    email: 'joao.pedro@codeflow.com',
    bio: 'QA Engineer especializado em testes automatizados e garantia de qualidade. Experiência em Cypress, Jest e metodologias de teste.',
    skills: ['Testes Automatizados', 'Cypress', 'Jest', 'CI/CD', 'Qualidade de Software']
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
    id: mockTeamMembers.length + 1,
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
