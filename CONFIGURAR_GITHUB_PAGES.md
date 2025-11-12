# 🔧 Configurar GitHub Pages

## 📋 Como Funciona

O workflow do GitHub Actions **cria automaticamente** a branch `gh-pages` quando você faz push para `main`. 

**IMPORTANTE:** A branch `gh-pages` só será criada **DEPOIS** que o workflow executar pela primeira vez!

## 🚀 Passo a Passo:

### 1. Faça commit e push do workflow atualizado:
```bash
git add .
git commit -m "Fix: Adicionar permissões para criar branch gh-pages"
git push
```

### 2. Aguarde o workflow executar:
- Vá em **Actions** (aba no topo do repositório)
- Clique no workflow **"Deploy to GitHub Pages"**
- Aguarde ele terminar com ✅ (pode levar 2-5 minutos)

### 3. Verifique se a branch `gh-pages` foi criada:
- Vá em **Code** → clique em **branches** (ou digite `gh-pages` na busca)
- Você deve ver a branch `gh-pages` na lista

### 4. Configure o GitHub Pages:
1. Vá em **Settings** (aba no topo do repositório)
2. Role até **Pages** (menu lateral esquerdo)
3. Em **Source**, selecione: **Deploy from a branch**
4. Em **Branch**, selecione: **gh-pages**
5. Em **Folder**, selecione: **/ (root)**
6. Clique em **Save**

### 5. Aguarde alguns minutos:
- O GitHub Pages pode levar 1-5 minutos para publicar
- Você verá a URL em: `https://SEU-USUARIO.github.io/Projeto_Angular_Consultores/`

## ✅ Verificar se está funcionando:

1. Vá em **Actions** (aba no topo do repositório)
2. Verifique se o workflow **"Deploy to GitHub Pages"** foi executado com sucesso ✅
3. Se houver erros, clique no workflow e veja os logs

## 🐛 Se ainda estiver mostrando o README:

1. Verifique se a branch `gh-pages` foi criada:
   - Vá em **Code** → **branches**
   - Procure por `gh-pages`

2. Verifique se o arquivo `.nojekyll` está na branch `gh-pages`:
   - Vá em **Code** → selecione branch `gh-pages`
   - Deve haver um arquivo `.nojekyll` na raiz

3. Force um novo deploy:
   - Faça um pequeno commit (ex: atualizar README)
   - Faça push para `main`
   - O workflow será executado automaticamente

## 📝 Nota sobre a URL:

A URL do GitHub Pages será:
```
https://SEU-USUARIO.github.io/Projeto_Angular_Consultores/
```

**NÃO** acesse:
- ❌ `https://SEU-USUARIO.github.io/` (sem o nome do repositório)
- ✅ `https://SEU-USUARIO.github.io/Projeto_Angular_Consultores/` (com o nome do repositório)

