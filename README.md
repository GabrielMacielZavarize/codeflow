
# Sistema de Priorização de Tarefas - CodeFlow Solutions

Este projeto é um sistema web para priorização de tarefas empresariais, desenvolvido para a empresa fictícia "CodeFlow Solutions". A aplicação permite o gerenciamento estratégico de tarefas com diferentes níveis de prioridade, ajudando a otimizar entregas, evitar retrabalhos e melhorar a distribuição de recursos.

## Tecnologias Utilizadas

- React
- TypeScript
- Tailwind CSS
- Firebase Authentication (incluindo login com Google)
- React Router
- React Query
- Shadcn/ui
- Recharts (para gráficos interativos)

## Configuração Inicial do Projeto

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm, yarn, pnpm ou bun
- Git

### Passos para Instalação

1. Clone o repositório:
   ```bash
   git clone <URL_DO_REPOSITÓRIO>
   cd codeflow-tasks
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn
   # ou
   pnpm install
   # ou
   bun install
   ```

3. Configure as credenciais do Firebase:
   - Siga as instruções em [docs/firebase.md](./docs/firebase.md) para criar um projeto no Firebase
   - Substitua as credenciais no arquivo `src/services/firebase.ts`

4. Execute o projeto em modo de desenvolvimento:
   ```bash
   npm run dev
   # ou
   yarn dev
   # ou
   pnpm dev
   # ou
   bun dev
   ```

5. Acesse `http://localhost:5173` no seu navegador (ou a porta indicada no terminal)

## Credenciais Padrão para Testes

Durante o desenvolvimento, você pode usar as seguintes credenciais para fazer login:
- **Email:** admin@admin.com
- **Senha:** 1234

## Funcionalidades

### Autenticação de usuários
- Registro e login com email/senha
- Login com Google
- Recuperação de senha

### Dashboard de tarefas
- Visualização de tarefas por prioridades
- Filtro avançado de tarefas
- Interface para adicionar novas tarefas
- Sistema visual de indicação de prioridades

### Detalhes de tarefas
- Visualização completa das informações da tarefa
- Edição e exclusão de tarefas
- Atribuição de tarefas a membros da equipe

### Gestão de equipe
- Visualização de membros da equipe
- Adição de novos membros
- Atribuição de tarefas a membros específicos

### Analytics
- Gráficos de distribuição de tarefas
- Análises de produtividade

### Controle de Acesso (RBAC)
- Três níveis de acesso: Admin, Manager e User
- Permissões diferentes por nível

### Suporte a Múltiplos Idiomas
- Inglês (en-US)
- Português (pt-BR)
- Espanhol (es)

## Estrutura do Projeto

```
codeflow-tasks/
├── docs/               # Documentação detalhada do projeto
├── public/             # Arquivos estáticos
├── src/                # Código-fonte
│   ├── components/     # Componentes reutilizáveis
│   ├── contexts/       # Contextos React (auth, theme, etc)
│   ├── hooks/          # Hooks personalizados
│   ├── i18n/           # Traduções e internacionalização
│   ├── lib/            # Bibliotecas e utilidades
│   ├── pages/          # Componentes de página
│   ├── services/       # Serviços (API, Firebase, etc)
│   ├── styles/         # Estilos globais
│   ├── App.tsx         # Componente principal
│   └── main.tsx        # Ponto de entrada
├── tailwind.config.ts  # Configuração do Tailwind CSS
└── vite.config.ts      # Configuração do Vite
```

## Documentação Adicional

Para informações mais detalhadas, consulte:

- [Configuração do Firebase](./docs/firebase.md)
- [Sistema de Autenticação](./docs/auth.md)
- [Controle de Acesso e Papéis](./docs/roles.md)
- [Estrutura de Tarefas](./docs/tasks.md)
- [Gerenciamento de Equipe](./docs/team.md)

## Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/amazing-feature`)
3. Faça commit das suas mudanças (`git commit -m 'Add some amazing feature'`)
4. Faça push para a branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes.
