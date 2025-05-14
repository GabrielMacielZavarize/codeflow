
# Perguntas Frequentes (FAQ)

Este documento reúne respostas para dúvidas comuns sobre o sistema de priorização de tarefas da CodeFlow Solutions.

## Perguntas Gerais

### O que é o sistema de priorização de tarefas da CodeFlow Solutions?

R: É uma aplicação web desenvolvida para ajudar equipes a gerenciar suas tarefas de forma eficiente, com ênfase na priorização estratégica. O sistema permite categorizar tarefas por níveis de prioridade, atribuí-las a membros específicos da equipe e monitorar seu progresso através de uma interface intuitiva.

### Quais são os principais benefícios deste sistema?

R: Os principais benefícios incluem:
- Melhor organização e visualização das tarefas
- Priorização clara e consistente do trabalho
- Aumento da produtividade da equipe
- Redução de retrabalhos e esquecimentos
- Análises e relatórios para tomada de decisão
- Transparência no acompanhamento do trabalho
- Controle de acesso baseado em funções (RBAC)
- Integração com calendário para visualizar prazos

### O sistema é gratuito?

R: Este é um projeto de código aberto disponibilizado para fins educacionais e de demonstração. Você pode implantá-lo e utilizá-lo gratuitamente, arcando apenas com os custos de infraestrutura (como hospedagem e serviços do Firebase).

### Quais tecnologias são utilizadas?

R: O sistema utiliza:
- React (frontend)
- TypeScript (linguagem)
- Tailwind CSS (estilos)
- Firebase (autenticação e banco de dados)
- Tanstack Query (gerenciamento de estado)
- Shadcn/ui (componentes de interface)
- Recharts (gráficos e visualizações)

## Instalação e Configuração

### Como faço para instalar o sistema localmente?

R: Para instalar o sistema em seu ambiente local:
1. Clone o repositório usando `git clone [URL_DO_REPOSITÓRIO]`
2. Navegue até a pasta do projeto com `cd codeflow-tasks`
3. Instale as dependências com `npm install` ou `yarn install`
4. Configure o Firebase seguindo as instruções em `/docs/firebase.md`
5. Inicie o servidor de desenvolvimento com `npm run dev` ou `yarn dev`
6. Acesse `http://localhost:8080` no seu navegador

### Como configuro o Firebase para o projeto?

R: Consulte o documento detalhado em `/docs/firebase.md`, que contém instruções passo a passo para criar um projeto no Firebase, configurar autenticação e integrar com o sistema.

### Quais são os requisitos mínimos para executar o sistema?

R: Os requisitos mínimos são:
- Node.js versão 14.x ou superior
- NPM versão 6.x ou superior (ou Yarn 1.22+)
- Navegador moderno (Chrome, Firefox, Safari ou Edge nas versões mais recentes)
- Conexão à internet para configuração inicial e uso do Firebase

## Uso do Sistema

### Como faço login no sistema pela primeira vez?

R: Ao executar o sistema pela primeira vez, você precisará:
1. Acessar a página de cadastro
2. Criar uma conta com seu email e senha
3. Alternativamente, usar a opção "Continuar com Google"
4. Após o cadastro, você será redirecionado para a dashboard

### Como posso alterar minha senha?

R: Para alterar sua senha:
1. Acesse a página de login
2. Clique em "Esqueceu a senha?"
3. Digite seu email e clique em "Enviar email de recuperação"
4. Verifique seu email e siga as instruções recebidas

### Como criar uma nova tarefa?

R: Para criar uma nova tarefa:
1. Na dashboard, clique no botão "Nova Tarefa"
2. Preencha os campos obrigatórios (título, descrição, prioridade)
3. Opcionalmente, defina data de entrega e responsável
4. Clique em "Criar Tarefa"

### Como atribuir uma tarefa a outro membro da equipe?

R: Para atribuir ou reatribuir uma tarefa:
1. Acesse os detalhes da tarefa clicando nela na lista
2. Clique no botão "Editar"
3. No campo "Atribuir a", selecione o membro da equipe desejado
4. Clique em "Salvar Alterações"

### O que significam os diferentes níveis de prioridade?

R: Os níveis de prioridade são:
- **Alta**: Tarefas críticas que exigem atenção imediata (vermelho)
- **Média**: Tarefas importantes, mas não urgentes (amarelo/laranja)
- **Baixa**: Tarefas que podem ser realizadas quando houver disponibilidade (azul)

### Como filtrar tarefas?

R: Para filtrar tarefas:
1. Na dashboard, localize a barra de filtros
2. Utilize os menus dropdown para filtrar por prioridade, status ou responsável
3. Use o campo de busca para encontrar tarefas por título ou descrição
4. Os filtros são aplicados instantaneamente à lista de tarefas

## Administração e Papéis

### Quais são os diferentes papéis de usuário no sistema?

R: O sistema possui três papéis principais:
- **Admin**: Acesso completo a todas as funcionalidades, incluindo exclusão de dados
- **Manager**: Pode gerenciar equipes e tarefas, mas sem acesso a operações críticas
- **User**: Acesso limitado a suas próprias tarefas e informações básicas

### Como alterar o papel de um usuário?

R: Atualmente, a alteração de papéis precisa ser feita diretamente no banco de dados (Firestore). Em futuras versões, será implementada uma interface administrativa para esta função.

### Quem pode ver os relatórios e análises?

R: Os relatórios e análises são acessíveis aos usuários com papéis de Admin e Manager. Usuários comuns não têm acesso a estas funcionalidades.

### O que são os logs de auditoria?

R: Os logs de auditoria registram ações importantes realizadas no sistema, como criação, edição e exclusão de tarefas. Eles são acessíveis apenas para usuários com papel de Admin e ajudam a manter um histórico de atividades para fins de segurança e rastreabilidade.

## Personalização e Recursos

### Como alternar entre os modos claro e escuro?

R: Para alternar entre os modos claro e escuro, clique no ícone de sol/lua na barra de navegação. A preferência é salva automaticamente e será mantida nas próximas visitas.

### Como visualizar tarefas no calendário?

R: Para visualizar tarefas no calendário:
1. No menu lateral, clique em "Calendário"
2. As tarefas com data de entrega definida serão exibidas nos respectivos dias
3. Clique em uma tarefa no calendário para ver seus detalhes

### Posso exportar os dados das tarefas?

R: Sim, na página de Relatórios, você pode exportar os dados em formato PDF ou CSV utilizando as opções disponíveis no canto superior direito da tela.

### O sistema envia notificações?

R: Sim, o sistema envia notificações sobre eventos importantes como:
- Tarefas atribuídas a você
- Tarefas próximas da data de entrega
- Tarefas marcadas como concluídas
- Comentários em tarefas que você participa

## Solução de Problemas

### O que fazer se eu esquecer minha senha?

R: Na página de login, clique em "Esqueceu a senha?" e siga o processo de recuperação utilizando seu email cadastrado.

### Por que não consigo excluir uma tarefa?

R: Apenas usuários com papel de Admin podem excluir tarefas. Se você não consegue excluir, provavelmente não tem as permissões necessárias.

### O sistema está lento. O que fazer?

R: Se o sistema estiver lento:
1. Verifique sua conexão com a internet
2. Limpe o cache do navegador
3. Verifique se há muitos filtros aplicados (isso pode aumentar o tempo de processamento)
4. Se o problema persistir, tente atualizar a página ou usar outro navegador

### Não consigo criar um novo membro na equipe. Por quê?

R: A criação de membros da equipe é restrita a usuários com papéis de Admin e Manager. Verifique se você possui as permissões necessárias.

### Como reportar um bug ou sugerir uma nova funcionalidade?

R: Para reportar bugs ou sugerir novas funcionalidades, você pode:
1. Abrir uma issue no repositório do GitHub
2. Entrar em contato com os mantenedores do projeto
3. Contribuir diretamente com um pull request, se tiver habilidades técnicas

## Segurança e Privacidade

### Meus dados estão seguros?

R: O sistema utiliza práticas modernas de segurança, incluindo:
- Autenticação segura via Firebase
- Controle de acesso baseado em papéis
- Regras de segurança no Firestore
- Comunicação criptografada via HTTPS

No entanto, a segurança final depende também de sua implementação e configuração adequada do Firebase.

### Quem pode ver minhas tarefas?

R: Por padrão, administradores e gerentes podem ver todas as tarefas no sistema. Usuários comuns podem ver apenas as tarefas atribuídas a eles ou criadas por eles.

### O sistema armazena senhas?

R: O sistema não armazena senhas diretamente. A autenticação é gerenciada pelo Firebase Authentication, que utiliza práticas seguras de armazenamento e criptografia.

## Desenvolvimento e Contribuição

### Como posso contribuir para o projeto?

R: Para contribuir:
1. Faça um fork do repositório
2. Clone seu fork localmente
3. Crie uma branch para sua contribuição
4. Faça as alterações desejadas
5. Envie um pull request com suas mudanças
6. Aguarde a revisão dos mantenedores

### Onde encontro a documentação para desenvolvedores?

R: A documentação para desenvolvedores está disponível na pasta `/docs` do projeto. Ela contém informações detalhadas sobre a estrutura do código, APIs, e como estender o sistema.

### Posso usar este projeto comercialmente?

R: Verifique a licença do projeto (geralmente em um arquivo LICENSE na raiz do repositório) para entender os termos de uso. Em muitos casos, projetos de código aberto permitem uso comercial com algumas restrições ou requisitos de atribuição.
