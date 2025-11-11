# 🚀 Guia de Deploy - Projeto Consultores

Este guia explica como publicar o projeto no GitHub Pages mantendo todas as funcionalidades (Firebase + MongoDB).

## 📋 Estrutura do Deploy

- **Frontend (Angular)**: GitHub Pages (gratuito)
- **Backend (Node.js)**: Heroku, Vercel, Railway ou Render (gratuito)
- **Firebase**: Já está na nuvem ✅
- **MongoDB**: MongoDB Atlas (gratuito) ou manter local

---

## 🔧 Passo 1: Configurar MongoDB na Nuvem (MongoDB Atlas)

### 1.1 Criar conta no MongoDB Atlas
1. Acesse: https://www.mongodb.com/cloud/atlas
2. Crie uma conta gratuita
3. Crie um novo cluster (Free tier - M0)

### 1.2 Configurar acesso
1. Vá em **Database Access** → **Add New Database User**
2. Crie um usuário e senha
3. Vá em **Network Access** → **Add IP Address**
4. Adicione `0.0.0.0/0` (permite acesso de qualquer lugar)

### 1.3 Obter string de conexão
1. Vá em **Database** → **Connect**
2. Escolha **Connect your application**
3. Copie a connection string (ex: `mongodb+srv://usuario:senha@cluster.mongodb.net/consultores`)

---

## 🌐 Passo 2: Hospedar o Backend

### Opção A: Render (Recomendado - Gratuito)

1. Acesse: https://render.com
2. Crie uma conta (pode usar GitHub)
3. Clique em **New +** → **Web Service**
4. Conecte seu repositório GitHub
5. Configure:
   - **Name**: `consultores-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Adicione as variáveis de ambiente:
   ```
   PORT=3001
   MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/consultores
   FIREBASE_PROJECT_ID=consultores-app-5f8f4
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@consultores-app-5f8f4.iam.gserviceaccount.com
   ```
7. Clique em **Create Web Service**
8. Anote a URL gerada (ex: `https://consultores-backend.onrender.com`)

### Opção B: Railway

1. Acesse: https://railway.app
2. Crie uma conta
3. **New Project** → **Deploy from GitHub repo**
4. Selecione o repositório
5. Configure:
   - **Root Directory**: `backend`
   - Adicione as mesmas variáveis de ambiente do Render
6. Anote a URL gerada

### Opção C: Heroku

1. Acesse: https://heroku.com
2. Crie uma conta
3. Instale Heroku CLI
4. Execute:
   ```bash
   cd backend
   heroku create consultores-backend
   heroku config:set MONGODB_URI=mongodb+srv://...
   heroku config:set FIREBASE_PROJECT_ID=consultores-app-5f8f4
   heroku config:set FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
   heroku config:set FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@...
   git push heroku main
   ```

---

## 📦 Passo 3: Atualizar Environment de Produção

Atualize o arquivo `consultores-app/src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://sua-url-backend.onrender.com/api', // Substitua pela URL do seu backend
  firebase: {
    apiKey: 'AIzaSyAPUDadOmLqwbChNq4NjQUVU8eqn_Si5uw',
    authDomain: 'consultores-app-5f8f4.firebaseapp.com',
    projectId: 'consultores-app-5f8f4',
    storageBucket: 'consultores-app-5f8f4.firebasestorage.app',
    messagingSenderId: '63344945679',
    appId: '1:63344945679:web:4a858c3cf7ccd0bb98917a'
  }
};
```

---

## 🎨 Passo 4: Configurar GitHub Pages

### 4.1 Instalar gh-pages (opcional)
```bash
npm install -g angular-cli-ghpages
```

### 4.2 Build do projeto
```bash
cd consultores-app
ng build --configuration production --base-href /nome-do-repositorio/
```

**Importante**: Substitua `nome-do-repositorio` pelo nome do seu repositório no GitHub.

### 4.3 Deploy para GitHub Pages
```bash
npx angular-cli-ghpages --dir=dist/consultores-app/browser
```

Ou use o GitHub Actions (veja abaixo).

---

## 🤖 Passo 5: Automatizar com GitHub Actions (Recomendado)

Crie o arquivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd consultores-app
          npm install
      
      - name: Build
        run: |
          cd consultores-app
          npm run build -- --configuration production --base-href /nome-do-repositorio/
        env:
          NODE_OPTIONS: '--max_old_space_size=4096'
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./consultores-app/dist/consultores-app/browser
```

**Substitua `nome-do-repositorio` pelo nome do seu repositório.**

---

## ⚙️ Passo 6: Configurar GitHub Pages no Repositório

1. Vá em **Settings** do seu repositório
2. **Pages** → **Source**: Selecione **GitHub Actions**
3. Salve

---

## ✅ Passo 7: Verificar

1. Após o deploy, acesse: `https://seu-usuario.github.io/nome-do-repositorio/`
2. Teste:
   - Login/Registro (Firebase)
   - Criar consultor
   - Listar consultores
   - Editar/Excluir

---

## 🔒 Segurança

### ⚠️ IMPORTANTE: Variáveis Sensíveis

**NUNCA** faça commit de:
- Arquivo `.env` do backend
- Credenciais do Firebase Admin SDK
- Senhas do MongoDB

Use variáveis de ambiente no serviço de hospedagem.

---

## 📝 Checklist Final

- [ ] MongoDB Atlas configurado
- [ ] Backend hospedado (Render/Railway/Heroku)
- [ ] URL do backend atualizada no `environment.prod.ts`
- [ ] Build de produção testado localmente
- [ ] GitHub Actions configurado
- [ ] GitHub Pages ativado
- [ ] Testes realizados na versão de produção

---

## 🐛 Troubleshooting

### Problema: CORS Error
**Solução**: Configure CORS no backend para aceitar sua URL do GitHub Pages:
```javascript
app.use(cors({
  origin: ['https://seu-usuario.github.io', 'http://localhost:4200']
}));
```

### Problema: Firebase não funciona
**Solução**: Verifique se as credenciais do Firebase estão corretas no `environment.prod.ts`

### Problema: Backend não conecta ao MongoDB
**Solução**: Verifique a connection string do MongoDB Atlas e o IP whitelist

---

## 📚 Recursos

- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Render](https://render.com)
- [Railway](https://railway.app)
- [GitHub Pages](https://pages.github.com)
- [Angular Deployment](https://angular.io/guide/deployment)

