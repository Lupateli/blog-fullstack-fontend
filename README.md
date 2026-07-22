# Mind Group - Frontend

Frontend da plataforma **Mind Group**, desenvolvido utilizando React, TypeScript e Vite.

O projeto consome a API do backend para oferecer autenticação, gerenciamento de artigos e edição de perfil.

---

## Tecnologias

- React
- TypeScript
- Vite
- React Router
- Axios
- Lucide React

---

## Funcionalidades

### Autenticação

- Login
- Cadastro
- Logout
- Rotas protegidas

### Home

- Listagem de artigos
- Destaques
- Navegação

### Artigos

- Visualização completa
- Comentários
- Curtidas
- Contador de visualizações

### Dashboard

- Estatísticas do usuário
- Lista de artigos publicados
- Gerenciamento dos artigos

### Perfil

- Alteração de nome
- Alteração de e-mail
- Alteração da biografia
- Upload de foto de perfil
- Pré-visualização da imagem

### Interface

- Responsiva
- Menu de usuário
- Avatar dinâmico
- Navegação entre páginas

---

## Estrutura

```
src
│
├── assets
├── components
├── contexts
├── pages
├── routes
├── services
├── styles
└── main.tsx
```

---

## Instalação

Clone o projeto

```bash
git clone https://github.com/Lupateli/blog-fullstack-frontend.git
```

Entre na pasta

```bash
cd blog-fullstack-frontend
```

Instale as dependências

```bash
npm install
```

Configure o arquivo `.env`

```env
VITE_API_URL=http://localhost:3000/api
VITE_BACKEND_URL=http://localhost:3000
```

Execute

```bash
npm run dev
```

---

## Scripts

```bash
npm run dev
```

Inicia o servidor.

```bash
npm run build
```

Gera a versão de produção.

```bash
npm run preview
```

Visualiza a build.

```bash
npm run lint
```

Executa o ESLint.

---

## Comunicação com a API

A aplicação utiliza Axios para comunicação com o backend.

Principais recursos consumidos:

- Autenticação
- Usuários
- Artigos
- Comentários
- Curtidas
- Dashboard

---

## Próximas melhorias

- Tema claro/escuro
- Recuperação de senha
- Alteração de senha
- Upload de banner dos artigos
- Paginação
- Sistema de notificações
- Infinite Scroll

---

## Autor

Desenvolvido por **Gabriel Lupateli**