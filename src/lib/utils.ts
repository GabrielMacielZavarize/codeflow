import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isMobile = () => {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}

export const truncateText = (text: string, maxLength: number = 30): string => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

// Função utilitária para extrair o username do GitHub
export function extrairUsernameGithub(url: string) {
  if (!url) return '';
  
  // Se a URL já for um username (sem http/https)
  if (!url.includes('http') && !url.includes('.')) {
    return url;
  }

  // Remove o .png do final se existir
  const urlSemExtensao = url.replace('.png', '');
  
  // Tenta extrair o username de diferentes formatos
  const match = urlSemExtensao.match(/(?:github\.com\/|unavatar\.io\/github\/)([^\/]+)/);
  return match ? match[1] : urlSemExtensao;
}

// Função para determinar a cor baseada na dificuldade
export function getDifficultyColor(dificuldade: string) {
  switch (dificuldade?.toLowerCase()) {
    case 'fácil':
    case 'facil':
      return 'bg-green-500';
    case 'média':
    case 'media':
      return 'bg-yellow-500';
    case 'difícil':
    case 'dificil':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
}
