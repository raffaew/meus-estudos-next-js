# 📋 Board de Tarefas

Aplicação de gerenciamento de tarefas construída com **Next.js 13+**, **Firebase** e **NextAuth.js**. Permite cadastrar tarefas, marcá-las como públicas ou privadas, compartilhar via link e adicionar comentários.

🌐 **[Acessar o projeto](https://meus-estudos-next-js.vercel.app)**

---

## ✨ Funcionalidades

- ✅ Login com conta Google
- ✅ Cadastrar tarefas públicas ou privadas
- ✅ Compartilhar tarefas públicas via link
- ✅ Adicionar comentários em tarefas públicas
- ✅ Visualizar tarefas públicas sem precisar estar logado
- ✅ Deletar tarefas
- ✅ Atualização em tempo real com Firebase

---

## 🛠️ Tecnologias utilizadas

- [Next.js 13+](https://nextjs.org/) — App Router, Server e Client Components, rotas dinâmicas
- [TypeScript](https://www.typescriptlang.org/) — tipagem estática
- [NextAuth.js](https://next-auth.js.org/) — autenticação com Google OAuth
- [Firebase Firestore](https://firebase.google.com/) — banco de dados em tempo real
- [CSS Modules](https://github.com/css-modules/css-modules) — estilização por componente
- [Vercel](https://vercel.com/) — deploy

---

## 🚀 Como rodar localmente

### Pré-requisitos
- Node.js 18+
- Conta no Firebase
- Credenciais do Google OAuth (Google Cloud Console)

### 1. Clone o repositório
```bash
git clone https://github.com/raffaew/meus-estudos-next-js.git
cd meus-estudos-next-js/projeto-board-tarefas
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env.local` na raiz do projeto:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua_secret_aqui

# Google OAuth
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret

# Firebase
NEXT_PUBLIC_URL=http://localhost:3000
```

> As chaves do Firebase ficam no arquivo `src/services/firebaseConnection.ts`

### 4. Rode o projeto
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

---

## 📁 Estrutura do projeto

```
src/
├── app/
│   ├── page.tsx               # Página inicial (Server Component)
│   ├── dashboard/
│   │   └── page.tsx           # Página do usuário logado
│   └── task/
│       └── [id]/
│           └── page.tsx       # Página pública da tarefa (rota dinâmica)
├── components/
│   ├── taskForm/              # Formulário de cadastro de tarefas
│   ├── taskList/              # Lista de tarefas do usuário
│   └── textarea/              # Componente reutilizável de textarea
├── services/
│   ├── firebaseConnection.ts  # Configuração do Firebase
│   └── saveTask.ts            # Serviço de cadastro de tarefas
└── lib/
    └── auth.ts                # Configuração do NextAuth
```

---

## 🔐 Como funciona a autenticação

A autenticação é feita via **Google OAuth** usando NextAuth.js.

| Situação | Permissões |
|---|---|
| Usuário **deslogado** | Visualizar tarefas públicas via `/task/[id]` |
| Usuário **logado** | Cadastrar tarefas, comentar, deletar |

---

## 💡 Destaques técnicos

**Server vs Client Components**
Componentes que apenas exibem dados rodam no servidor (sem JS extra no browser). Componentes com interação do usuário — `TaskForm`, `TaskList`, `Textarea` — rodam no cliente com `"use client"`.

**Rotas dinâmicas**
Cada tarefa pública possui sua própria página acessível via `/task/[id]`, onde o `id` é gerado automaticamente pelo Firebase.

**Tempo real**
A lista de tarefas usa `onSnapshot` do Firestore, atualizando automaticamente sem recarregar a página.

**Componente reutilizável**
O componente `Textarea` é compartilhado entre o formulário de cadastro de tarefas e a área de comentários.

---
