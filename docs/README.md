
# Sistema de Priorização de Tarefas - CodeFlow Solutions

## Visão Geral

O sistema de priorização de tarefas da CodeFlow Solutions é uma aplicação web desenvolvida para auxiliar equipes a gerenciar suas tarefas de forma eficiente, com foco em priorização estratégica. O sistema permite categorizar tarefas por níveis de prioridade, atribuí-las a membros da equipe, acompanhar seu progresso e visualizar dados analíticos para tomada de decisões.

## Propósito

O principal objetivo desta ferramenta é otimizar o fluxo de trabalho das equipes, evitando retrabalhos e garantindo que recursos sejam alocados de forma inteligente às tarefas mais importantes. Com uma interface intuitiva e recursos avançados, o sistema ajuda a:

- Priorizar tarefas estrategicamente
- Melhorar a visibilidade do progresso dos projetos
- Facilitar a colaboração entre membros da equipe
- Fornecer insights através de dados analíticos
- Manter um histórico auditável de atividades

## Instruções para Execução Local

Para executar o sistema em ambiente de desenvolvimento local, siga os passos abaixo:

### Pré-requisitos

- Node.js (versão 14 ou superior)
- NPM ou Yarn
- Conta no Firebase (para autenticação e armazenamento de dados)

### Passos para Instalação

1. Clone o repositório:
   ```bash
   git clone [URL_DO_REPOSITÓRIO]
   cd codeflow-tasks
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```

3. Configure as credenciais do Firebase:
   - Siga as instruções no arquivo [firebase.md](./firebase.md) para criar e configurar seu projeto no Firebase
   - Adicione as credenciais no arquivo de configuração adequado

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

5. Acesse a aplicação em seu navegador:
   ```
   http://localhost:8080
   ```

## Estrutura Básica do Projeto

```
codeflow-tasks/
├── docs/               # Documentação do projeto
├── node_modules/       # Dependências do projeto
├── public/             # Arquivos estáticos
├── src/                # Código-fonte
│   ├── components/     # Componentes reutilizáveis
│   ├── contexts/       # Contextos React (auth, theme, etc)
│   ├── hooks/          # Hooks personalizados
│   ├── lib/            # Bibliotecas e utilidades
│   ├── pages/          # Componentes de página
│   ├── services/       # Serviços (API, Firebase, etc)
│   ├── styles/         # Estilos globais e específicos
│   ├── App.tsx         # Componente principal
│   └── main.tsx        # Ponto de entrada
├── .gitignore          # Arquivos ignorados pelo Git
├── package.json        # Dependências e scripts
├── tailwind.config.ts  # Configuração do Tailwind CSS
└── vite.config.ts      # Configuração do Vite
```

## Tecnologias Principais

- **React**: Biblioteca JavaScript para construção de interfaces
- **TypeScript**: Superset tipado de JavaScript
- **Tailwind CSS**: Framework de CSS utilitário
- **Firebase**: Plataforma para autenticação e banco de dados
- **React Router**: Roteamento para aplicações React
- **Tanstack Query**: Gerenciamento de estado do servidor
- **Shadcn/ui**: Componentes de UI reutilizáveis
- **Recharts**: Biblioteca para criação de gráficos

## Documentação Adicional

Para informações mais detalhadas sobre aspectos específicos do sistema, consulte:

- [Configuração do Firebase](./firebase.md)
- [Sistema de Autenticação](./auth.md)
- [Controle de Acesso e Papéis](./roles.md)
- [Análise de Dados e Gráficos](./analytics.md)
- [Estrutura de Tarefas](./tasks.md)
- [Gerenciamento de Equipe](./team.md)
- [Perguntas Frequentes](./faq.md)
