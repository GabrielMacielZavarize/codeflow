
# Analytics e Visualização de Dados

Este documento detalha a implementação e o funcionamento da visualização de dados e analytics no sistema de priorização de tarefas da CodeFlow Solutions.

## Visão Geral

O sistema oferece uma série de visualizações gráficas e análises que permitem aos usuários obter insights sobre o desempenho da equipe, distribuição de tarefas e progresso dos projetos. Essas visualizações são implementadas utilizando bibliotecas modernas de gráficos para React.

## Bibliotecas Utilizadas

O sistema utiliza principalmente duas bibliotecas de visualização de dados:

### 1. Recharts

Uma biblioteca de gráficos construída com componentes React puros, utilizada para a maioria dos gráficos interativos no sistema.

**Características principais**:
- Componentes React nativos
- Alto desempenho
- Personalizável e responsivo
- Suporte a animações

### 2. Chart.js com React-Chartjs-2

Uma biblioteca popular de gráficos JavaScript com wrapper React, utilizada para alguns gráficos específicos.

**Características principais**:
- Ampla variedade de tipos de gráficos
- Animações fluidas
- Responsividade
- Excelente desempenho

## Tipos de Gráficos Implementados

### 1. Gráfico de Pizza: Distribuição de Tarefas por Prioridade

**Implementação**:
```typescript
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// Dados mockados ou vindos da API
const data = [
  { name: 'Alta', value: 12, color: '#ef4444' },
  { name: 'Média', value: 25, color: '#f59e0b' },
  { name: 'Baixa', value: 18, color: '#3b82f6' },
];

// Componente de gráfico
const PriorityDistribution = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} tarefas`, 'Quantidade']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};
```

**Finalidade**: Visualizar rapidamente a distribuição de tarefas por nível de prioridade, permitindo identificar desequilíbrios (por exemplo, muitas tarefas de alta prioridade).

### 2. Gráfico de Barras: Tarefas Criadas por Semana

**Implementação**:
```typescript
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Dados mockados ou vindos da API
const data = [
  { week: 'Semana 1', tasks: 10 },
  { week: 'Semana 2', tasks: 15 },
  { week: 'Semana 3', tasks: 8 },
  { week: 'Semana 4', tasks: 12 },
];

// Componente de gráfico
const WeeklyTasksCreated = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="tasks" fill="#8b5cf6" name="Tarefas Criadas" />
      </BarChart>
    </ResponsiveContainer>
  );
};
```

**Finalidade**: Monitorar o volume de trabalho ao longo do tempo, identificando padrões ou picos na criação de tarefas.

### 3. Gráfico de Linha: Evolução de Tarefas Concluídas

**Implementação**:
```typescript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Dados mockados ou vindos da API
const data = [
  { month: 'Jan', completed: 15 },
  { month: 'Fev', completed: 18 },
  { month: 'Mar', completed: 22 },
  { month: 'Abr', completed: 25 },
  { month: 'Mai', completed: 32 },
  { month: 'Jun', completed: 28 },
];

// Componente de gráfico
const CompletedTasksOverTime = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="completed" 
          stroke="#10b981" 
          activeDot={{ r: 8 }}
          name="Tarefas Concluídas" 
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
```

**Finalidade**: Visualizar a tendência de produtividade da equipe ao longo do tempo, mostrando quantas tarefas são concluídas a cada mês.

### 4. Gráfico de Barras Empilhadas: Status de Tarefas por Membro da Equipe

**Implementação**:
```typescript
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Dados mockados ou vindos da API
const data = [
  { name: 'João', pending: 4, inProgress: 2, completed: 8 },
  { name: 'Maria', pending: 3, inProgress: 5, completed: 12 },
  { name: 'Pedro', pending: 2, inProgress: 4, completed: 6 },
  { name: 'Ana', pending: 5, inProgress: 1, completed: 9 },
];

// Componente de gráfico
const TeamMemberTaskStatus = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="pending" stackId="a" fill="#f59e0b" name="Pendentes" />
        <Bar dataKey="inProgress" stackId="a" fill="#3b82f6" name="Em Progresso" />
        <Bar dataKey="completed" stackId="a" fill="#10b981" name="Concluídas" />
      </BarChart>
    </ResponsiveContainer>
  );
};
```

**Finalidade**: Comparar a produtividade e o volume de trabalho entre os membros da equipe, mostrando a distribuição de tarefas por status para cada pessoa.

## Página de Analytics

A página de Analytics (`/analytics`) é onde os principais gráficos e métricas do sistema são exibidos. Ela é implementada no arquivo `src/pages/Analytics.tsx`.

### Estrutura da Página

```tsx
// Versão simplificada de Analytics.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// Importações dos gráficos e serviços

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadAnalyticsData = async () => {
      setIsLoading(true);
      try {
        // Carregar dados da API ou mock
        const data = await getAnalyticsData();
        setAnalyticsData(data);
      } catch (error) {
        console.error('Erro ao carregar dados de analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAnalyticsData();
  }, []);
  
  if (isLoading) {
    return <div>Carregando...</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Analytics</h1>
      
      {/* Cartões de métricas resumidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard title="Total de Tarefas" value={analyticsData.totalTasks} />
        <MetricCard title="Tarefas Concluídas" value={analyticsData.completedTasks} />
        <MetricCard title="Taxa de Conclusão" value={`${analyticsData.completionRate}%`} />
        <MetricCard title="Média por Membro" value={analyticsData.tasksPerMember} />
      </div>
      
      {/* Gráficos principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Prioridade</CardTitle>
            <CardDescription>Tarefas agrupadas por nível de prioridade</CardDescription>
          </CardHeader>
          <CardContent>
            <PriorityDistribution data={analyticsData.priorityDistribution} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tarefas Criadas por Semana</CardTitle>
            <CardDescription>Evolução da criação de tarefas nas últimas semanas</CardDescription>
          </CardHeader>
          <CardContent>
            <WeeklyTasksCreated data={analyticsData.weeklyTasks} />
          </CardContent>
        </Card>
      </div>
      
      {/* Mais gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolução de Tarefas Concluídas</CardTitle>
            <CardDescription>Tendência de conclusão de tarefas ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent>
            <CompletedTasksOverTime data={analyticsData.completedOverTime} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Status por Membro da Equipe</CardTitle>
            <CardDescription>Distribuição de tarefas por status para cada membro</CardDescription>
          </CardHeader>
          <CardContent>
            <TeamMemberTaskStatus data={analyticsData.teamMemberStatus} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
```

## Serviço de Dados Analíticos

Os dados para os gráficos são fornecidos por um serviço dedicado:

```typescript
// src/services/analyticsService.ts
import { db } from './firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';

// Interface para os dados analíticos
export interface AnalyticsData {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  tasksPerMember: number;
  priorityDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  weeklyTasks: Array<{
    week: string;
    tasks: number;
  }>;
  completedOverTime: Array<{
    month: string;
    completed: number;
  }>;
  teamMemberStatus: Array<{
    name: string;
    pending: number;
    inProgress: number;
    completed: number;
  }>;
}

// Função principal para obter dados analíticos
export const getAnalyticsData = async (): Promise<AnalyticsData> => {
  try {
    // Em uma implementação real, aqui seriam feitas consultas ao Firestore
    // ou chamadas a uma API backend para obter os dados reais
    
    // Para demonstração, retornamos dados mockados
    return {
      totalTasks: 120,
      completedTasks: 75,
      completionRate: 62.5,
      tasksPerMember: 15,
      priorityDistribution: [
        { name: 'Alta', value: 32, color: '#ef4444' },
        { name: 'Média', value: 56, color: '#f59e0b' },
        { name: 'Baixa', value: 32, color: '#3b82f6' },
      ],
      weeklyTasks: [
        { week: 'Semana 1', tasks: 18 },
        { week: 'Semana 2', tasks: 22 },
        { week: 'Semana 3', tasks: 16 },
        { week: 'Semana 4', tasks: 25 },
      ],
      completedOverTime: [
        { month: 'Jan', completed: 10 },
        { month: 'Fev', completed: 15 },
        { month: 'Mar', completed: 18 },
        { month: 'Abr', completed: 22 },
        { month: 'Mai', completed: 28 },
        { month: 'Jun', completed: 25 },
      ],
      teamMemberStatus: [
        { name: 'João', pending: 4, inProgress: 2, completed: 8 },
        { name: 'Maria', pending: 3, inProgress: 5, completed: 12 },
        { name: 'Pedro', pending: 2, inProgress: 4, completed: 6 },
        { name: 'Ana', pending: 5, inProgress: 1, completed: 9 },
      ]
    };
  } catch (error) {
    console.error('Erro ao obter dados analíticos:', error);
    throw new Error('Falha ao carregar dados analíticos');
  }
};

// Outras funções específicas para diferentes tipos de análise...
```

## Componentes de Cartões de Métricas

Para exibir métricas resumidas, o sistema utiliza cartões de métricas:

```typescript
// Componente de cartão de métrica
interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}

const MetricCard = ({ title, value, icon }: MetricCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          {icon && (
            <div className="text-gray-400 dark:text-gray-500">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
```

## Estratégias de Implementação para Produção

Em um ambiente de produção, os dados para os gráficos viriam de consultas ao banco de dados ou chamadas a APIs. Algumas estratégias recomendadas:

1. **Caching de dados**: Implementar cache para evitar consultas repetidas ao banco de dados.

2. **Consultas eficientes**: Otimizar consultas ao Firestore para obter apenas os dados necessários.

3. **Paginação e limites**: Para grandes conjuntos de dados, implementar paginação e limites de consulta.

4. **Atualização em tempo real**: Para dashboards que precisam de atualização em tempo real, utilizar listeners do Firestore.

5. **Exportação de dados**: Permitir que usuários exportem os dados analíticos em formatos como CSV ou PDF.

## Considerações sobre Personalização de Gráficos

O sistema permite personalização de gráficos para se adaptar ao tema escolhido pelo usuário:

```typescript
// Exemplo de adaptação de cores para o tema escuro
const getChartColors = (isDarkMode: boolean) => {
  return {
    primary: isDarkMode ? '#8b5cf6' : '#6d28d9',
    success: isDarkMode ? '#10b981' : '#059669',
    warning: isDarkMode ? '#f59e0b' : '#d97706',
    danger: isDarkMode ? '#ef4444' : '#dc2626',
    text: isDarkMode ? '#f3f4f6' : '#1f2937',
    grid: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
  };
};

// Uso nos componentes de gráfico
const colors = getChartColors(isDarkTheme);
```

## Requisitos de Dados para Gráficos

Para que os gráficos funcionem corretamente, as tarefas no banco de dados precisam incluir os seguintes campos:

```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'canceled';
  createdAt: Timestamp;
  completedAt?: Timestamp;
  dueDate?: Timestamp;
  assignedTo?: string;
  createdBy: string;
}
```

## Conclusão

O sistema de analytics fornece uma visão abrangente do progresso das tarefas e do desempenho da equipe, utilizando visualizações gráficas intuitivas. As bibliotecas Recharts e Chart.js fornecem uma base sólida para implementar gráficos interativos e responsivos que se adaptam ao tema escolhido pelo usuário.
