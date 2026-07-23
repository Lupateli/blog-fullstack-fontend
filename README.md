# Mind Group - Frontend

Frontend desenvolvido para o Case Técnico da Mind Group.

Aplicação React responsável pela interface do sistema de gerenciamento de posts.

---

##   Tecnologias

- React
- TypeScript
- Vite
- Axios
- React Router DOM
- CSS
- Docker
- Nginx

---

## Funcionalidades

- Cadastro
- Login
- Perfil
- Atualização de perfil
- Upload de avatar
- Dashboard
- CRUD de Posts
- Comentários
- Curtidas
- Visualização de Posts

---

## Instalação

Clone o projeto

```bash
git clone https://github.com/SEU_USUARIO/blog-fullstack-frontend.git
```

Entre na pasta

```bash
cd blog-fullstack-frontend
```

Instale as dependências

```bash
npm install
```

Crie o arquivo

```text
.env
```

Baseado em

```text
.env.example
```

Execute

```bash
npm run dev
```

---

# Docker

Construir

```bash
docker build -t mind-group-frontend .
```

Executar

```bash
docker run -d --name mind-group-frontend -p 8080:80 mind-group-frontend
```

Abrir

```
http://localhost:8080
```

---

## Variáveis de ambiente

```env
VITE_API_URL=http://localhost:3000
VITE_BACKEND_URL=http://localhost:3000
```

---

## Estrutura

```
src
│
├── assets
├── components
├── contexts
├── hooks
├── pages
├── routes
├── services
└── App.tsx
```

---

## Desenvolvedor

Gabriel Lupateli