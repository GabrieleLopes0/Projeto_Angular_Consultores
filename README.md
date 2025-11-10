# Projeto Consultores - SPA Angular

Sistema de gerenciamento de consultores com autenticação Firebase e backend Node.js/Express.

## 🚀 Como Iniciar

### Backend

1. Navegue até a pasta `backend`:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Crie um arquivo `.env` na pasta `backend` com:
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/consultores
```

4. Inicie o servidor:
```bash
npm start
```

✅ Backend rodando em `http://localhost:3001`

### Frontend

1. Navegue até a pasta `consultores-app`:
```bash
cd consultores-app
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o Firebase em `src/environments/environment.ts` (se ainda não configurou)

4. Inicie o servidor de desenvolvimento:
```bash
npm start
```

✅ Frontend rodando em `http://localhost:4200`

## 📋 Requisitos

- Node.js (v18 ou superior)
- MongoDB (local ou MongoDB Atlas)
- Firebase configurado (Authentication Email/Password)

## 🔧 Funcionalidades

- Autenticação com Firebase
- CRUD completo de consultores
- Busca e filtro por área
- Rotas protegidas
