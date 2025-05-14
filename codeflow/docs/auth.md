
# Sistema de Autenticação

Este documento detalha o sistema de autenticação implementado no projeto de priorização de tarefas da CodeFlow Solutions.

## Visão Geral

O sistema utiliza o Firebase Authentication para gerenciar a autenticação de usuários, oferecendo múltiplos métodos de login e um fluxo seguro para registro e recuperação de senha.

## Métodos de Autenticação

### 1. Email e Senha

Este é o método principal de autenticação, onde os usuários podem:
- Criar uma conta usando email e senha
- Fazer login com as credenciais cadastradas
- Recuperar a senha através de email

### 2. Login com Google

Permite que os usuários façam login usando suas contas Google, simplificando o processo de autenticação.

## Implementação Técnica

### Estrutura

O sistema de autenticação é composto por:

1. **Serviço Firebase**: Localizado em `src/services/firebase.ts`, contém todas as funções de autenticação
2. **Contexto de Autenticação**: Em `src/contexts/AuthContext.tsx`, gerencia o estado de autenticação globalmente
3. **Componentes de UI**: Formulários de login, registro e recuperação de senha
4. **Proteção de Rotas**: Componente `PrivateRoute` que verifica se o usuário está autenticado

### Firebase Service

```typescript
// Principais funções em src/services/firebase.ts

// Registro com email e senha
export const registerWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

// Login com email e senha
export const loginWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

// Login com Google
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

// Logout
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Recuperação de senha
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Observer para mudanças de estado de autenticação
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
```

### Contexto de Autenticação

O `AuthContext` fornece acesso ao estado de autenticação em toda a aplicação:

```typescript
// src/contexts/AuthContext.tsx
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      const { success, error } = await logoutUser();
      if (success) {
        setCurrentUser(null);
        toast({
          description: t.logout.success
        });
        navigate('/', { replace: true });
      } else {
        toast({
          description: error || t.logout.error,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        description: t.logout.error,
        variant: 'destructive'
      });
    }
  };

  const value = {
    currentUser,
    loading,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para acessar o contexto
export const useAuth = () => {
  return useContext(AuthContext);
};
```

### Proteção de Rotas

O componente `PrivateRoute` garante que apenas usuários autenticados acessem determinadas páginas:

```typescript
// src/components/PrivateRoute.tsx
const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    if (!loading && !currentUser) {
      toast.error(t.general.error);
      navigate('/login', { replace: true });
    }
  }, [currentUser, loading, navigate, t]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{t.general.loading}</p>
        </div>
      </div>
    );
  }

  return currentUser ? <>{children}</> : null;
};
```

## Fluxos de Autenticação

### Registro

1. O usuário acessa a página de registro
2. Preenche o formulário com email, senha e confirmação de senha
3. Ao submeter, a função `registerWithEmailAndPassword` é chamada
4. Se bem-sucedido, o usuário é automaticamente logado e redirecionado para o dashboard
5. Os dados adicionais do usuário são salvos no Firestore (coleção 'users')

### Login

1. O usuário acessa a página de login
2. Insere email e senha ou clica no botão de login com Google
3. Ao submeter, a função `loginWithEmailAndPassword` ou `loginWithGoogle` é chamada
4. Se bem-sucedido, o estado `currentUser` é atualizado e o usuário é redirecionado para o dashboard

### Recuperação de Senha

1. O usuário clica em "Esqueci minha senha" na página de login
2. Insere o email associado à conta
3. A função `resetPassword` envia um email com instruções
4. O usuário segue o link no email para definir uma nova senha

### Logout

1. O usuário clica no botão de logout na interface
2. A função `logout` do contexto é chamada
3. Se bem-sucedido, o estado `currentUser` é limpo e o usuário é redirecionado para a página inicial

## Integração com o Sistema de Papéis (RBAC)

Após a autenticação, o sistema verifica o papel (role) do usuário no Firestore:

```typescript
// Exemplo simplificado de verificação de papel
export const getUserRole = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data().role || 'user';
    }
    return 'user'; // Papel padrão
  } catch (error) {
    console.error('Erro ao buscar papel do usuário:', error);
    return 'user'; // Fallback para papel padrão em caso de erro
  }
};
```

## Persistência de Sessão

O Firebase Authentication gerencia automaticamente a persistência da sessão do usuário entre visitas ao site. Por padrão, a configuração é `LOCAL`, o que significa que a sessão persiste mesmo quando o navegador é fechado.

## Segurança

### Boas Práticas Implementadas

1. **Validação de Entrada**: Todos os formulários validam entradas antes do envio
2. **Senhas Seguras**: Requisitos mínimos de senha (comprimento, complexidade)
3. **Proteção contra Ataques de Força Bruta**: Limitação de tentativas de login pelo Firebase
4. **Tokens Seguros**: Firebase gerencia tokens JWT com expiração apropriada
5. **HTTPS**: Toda comunicação é feita via HTTPS

### Considerações Adicionais

- As credenciais de Firebase não são expostas ao cliente (apenas as configurações públicas)
- O sistema não armazena senhas, deixando essa responsabilidade para o Firebase
- Tokens de autenticação são armazenados apenas em memória segura no navegador

## Fluxograma do Sistema de Autenticação

```
┌─────────────┐       ┌───────────────┐       ┌───────────────┐
│             │       │               │       │               │
│  Usuário    │──────▶│    Firebase   │──────▶│  AuthContext  │
│  não        │       │  Authenticati │       │ (estado da    │
│  autenticado│       │      on       │       │  aplicação)   │
│             │       │               │       │               │
└─────────────┘       └───────────────┘       └───────┬───────┘
                                                     │
                                                     ▼
┌─────────────┐       ┌───────────────┐       ┌───────────────┐
│             │       │               │       │               │
│  Usuário    │◀──────│  Verificação  │◀──────│   Usuário     │
│  redirecio- │       │   de Papel    │       │  autenticado  │
│  nado       │       │    (RBAC)     │       │               │
│             │       │               │       │               │
└─────────────┘       └───────────────┘       └───────────────┘
```

## Customização da UI de Autenticação

A interface de autenticação foi desenvolvida usando o Shadcn/UI, garantindo uma experiência consistente com o resto da aplicação. Componentes como:

- Cards para formulários
- Inputs estilizados
- Botões primários e secundários
- Feedback visual de erros e sucessos
- Suporte a temas claro e escuro

## Testes

Para testar o sistema de autenticação:

1. **Credenciais de Teste**:
   - Email: admin@admin.com
   - Senha: 1234

2. **Testes de Fluxo**:
   - Teste o registro de um novo usuário
   - Teste o login com email/senha
   - Teste o login com Google
   - Teste a recuperação de senha
   - Teste o logout
   - Teste o acesso a rotas protegidas

## Solução de Problemas

### Problemas Comuns

1. **Login Falha Silenciosamente**:
   - Verifique se o método de autenticação está habilitado no console do Firebase
   - Confirme que as credenciais do Firebase estão corretas

2. **Usuário é Deslogado Inesperadamente**:
   - Verifique se há erros de token no console
   - Confirme que a configuração de persistência está correta

3. **Botão de Login com Google Não Funciona**:
   - Verifique se o login com Google está habilitado no console do Firebase
   - Confirme que o domínio está autorizado nas configurações do Firebase

4. **Erros de Redirecionamento**:
   - Verifique se as rotas estão configuradas corretamente
   - Confirme que o componente `PrivateRoute` está sendo usado adequadamente
