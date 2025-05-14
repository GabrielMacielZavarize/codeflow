
# Configuração do Firebase

Este guia explica como configurar o Firebase para o sistema de priorização de tarefas da CodeFlow Solutions, passo a passo.

## Criando um Projeto no Firebase

1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Dê um nome ao seu projeto (ex: "codeflow-tasks")
4. Escolha se deseja ativar o Google Analytics (recomendado)
5. Clique em "Criar projeto"
6. Aguarde a criação do projeto e clique em "Continuar"

## Adicionando o Firebase ao Projeto Web

1. No console do Firebase, clique no ícone da web (</>) na página inicial do projeto
2. Registre o aplicativo com um nome (ex: "codeflow-web")
3. Opcionalmente, configure o Firebase Hosting se desejar hospedar a aplicação
4. Clique em "Registrar app"
5. Copie o objeto `firebaseConfig` que será exibido

## Configurando a Autenticação

### Habilitando Métodos de Autenticação

1. No console do Firebase, acesse "Authentication" no menu lateral
2. Clique em "Começar" ou vá para a aba "Sign-in method"
3. Habilite os seguintes métodos de autenticação:

#### Email/Senha
1. Clique em "Email/Senha"
2. Ative a opção "Email/Senha"
3. Opcionalmente, ative "Link de e-mail para login sem senha"
4. Clique em "Salvar"

#### Google
1. Clique em "Google"
2. Ative a opção
3. Configure um email de suporte (geralmente seu email)
4. Clique em "Salvar"

### Configurando o Domínio Autorizado (para desenvolvimento local)

1. Na seção "Authentication", clique na aba "Settings"
2. Em "Authorized domains", clique em "Add domain"
3. Adicione "localhost" se ainda não estiver na lista
4. Clique em "Add"

## Configurando o Firestore Database

1. No console do Firebase, acesse "Firestore Database" no menu lateral
2. Clique em "Criar banco de dados"
3. Escolha entre "Iniciar no modo de produção" ou "Iniciar no modo de teste" (para desenvolvimento, o modo de teste é mais simples)
4. Selecione a região de hospedagem mais próxima de você ou de seus usuários
5. Clique em "Próxima" e depois em "Ativar"

## Configuração das Regras de Segurança do Firestore

Após criar o banco de dados, acesse a aba "Regras" no Firestore e configure as regras de segurança:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Função para verificar se o usuário é admin
    function isAdmin(request) {
      return request.auth != null && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Função para verificar se o usuário é gerente
    function isManager(request) {
      return request.auth != null && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'manager';
    }
    
    // Perfis de usuário
    match /users/{userId} {
      allow read: if request.auth != null && (request.auth.uid == userId || isAdmin(request) || isManager(request));
      allow create: if request.auth != null;
      allow update: if request.auth != null && (request.auth.uid == userId || isAdmin(request));
      allow delete: if request.auth != null && isAdmin(request);
    }
    
    // Tarefas
    match /tasks/{taskId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && (
        resource.data.createdBy == request.auth.uid ||
        resource.data.assignedTo == request.auth.uid ||
        isManager(request) || isAdmin(request)
      );
      allow delete: if request.auth != null && (
        resource.data.createdBy == request.auth.uid || isAdmin(request)
      );
    }
    
    // Membros da equipe
    match /teamMembers/{memberId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && (isAdmin(request) || isManager(request));
    }
    
    // Logs de auditoria
    match /auditLogs/{logId} {
      allow read: if request.auth != null && isAdmin(request);
      allow create: if request.auth != null;
      allow update, delete: if false;
    }
    
    // Configurações do usuário
    match /userSettings/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read, write: if request.auth != null && isAdmin(request);
    }
  }
}
```

## Integração no Projeto React

### Instalando as Dependências do Firebase

```bash
npm install firebase
# ou
yarn add firebase
# ou
pnpm add firebase
# ou
bun add firebase
```

### Configurando o Firebase no Projeto

1. Abra o arquivo `src/services/firebase.ts`
2. Substitua o objeto `firebaseConfig` existente com as credenciais copiadas do console do Firebase:

```typescript
// src/services/firebase.ts
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID",
  measurementId: "SEU_MEASUREMENT_ID" // Opcional, se tiver o Google Analytics habilitado
};
```

### Ativando o Firebase Real (Desabilitando o Modo Mock)

Para usar o Firebase real em vez do modo de mock para desenvolvimento:

1. Abra o arquivo `src/services/firebase.ts`
2. Encontre as funções de autenticação (como `loginWithEmailAndPassword`, `registerWithEmailAndPassword`, etc.)
3. Descomente o código do Firebase real e comente ou remova o código mock.

Exemplo para a função `loginWithEmailAndPassword`:

```typescript
export const loginWithEmailAndPassword = async (email: string, password: string) => {
  try {
    // Código mock comentado ou removido
    /*
    if (email === 'admin@admin.com' && password === '1234') {
      // ...código mock...
    } else {
      return { user: null, error: "Email ou senha incorretos" };
    }
    */
    
    // Código do Firebase real descomentado
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};
```

## Inicialização da Base de Dados

Para inicializar o banco de dados com alguns dados iniciais (como usuário admin):

1. Crie um usuário usando a função de registro
2. Use o Firestore para definir seu papel como 'admin'

```typescript
// Script exemplo para criar usuário admin (execute apenas uma vez)
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

const initializeAdmin = async () => {
  try {
    // Criar usuário admin
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      'admin@seudominio.com', 
      'senha_segura'
    );
    
    // Definir papel como admin
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email: 'admin@seudominio.com',
      name: 'Administrador',
      role: 'admin',
      createdAt: new Date()
    });
    
    console.log('Usuário admin criado com sucesso');
  } catch (error) {
    console.error('Erro ao criar usuário admin:', error);
  }
};

// Execute esta função apenas uma vez para inicialização
```

## Verificação da Configuração

Para verificar se tudo está funcionando corretamente:

1. Tente fazer login com as credenciais que você configurou
2. Verifique se o acesso ao Firestore está funcionando corretamente
3. Teste as operações CRUD para garantir que as regras de segurança estão funcionando como esperado

## Recursos Adicionais do Firebase

Além da autenticação e do Firestore, você pode explorar outros recursos do Firebase:

- **Storage**: Para armazenamento de arquivos (imagens, documentos, etc.)
- **Cloud Functions**: Para executar código no servidor em resposta a eventos
- **Hosting**: Para hospedar o aplicativo web
- **Analytics**: Para análise de uso
- **Crashlytics**: Para monitoramento de falhas

## Solução de Problemas Comuns

### Problemas de CORS
Se enfrentar problemas de CORS ao usar o Firebase, verifique:
- Se o domínio do seu aplicativo está permitido nas configurações do Firebase
- Se você está usando a versão mais recente do SDK do Firebase

### Erros de Autenticação
Para problemas de autenticação:
- Verifique se o método de autenticação está ativado no console
- Confirme que o email não está sendo usado por outra conta
- Verifique se as credenciais do Firebase estão corretas

### Erros do Firestore
- Verifique as regras de segurança
- Certifique-se de que está usando os métodos corretos para ler/escrever dados
- Verifique se os documentos e coleções têm a estrutura esperada

### Erros de Deploy
Para problemas com deploy:
- Verifique se a versão do Node.js é compatível
- Certifique-se de que as dependências estão instaladas corretamente
- Verifique se o arquivo firebase.json está configurado corretamente
