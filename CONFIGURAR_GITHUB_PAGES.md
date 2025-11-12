# 🔧 Configurar GitHub Pages

## ⚠️ IMPORTANTE: Configuração no GitHub

Após fazer o deploy, você precisa configurar o GitHub Pages para usar a branch `gh-pages`:

### Passo a Passo:

1. **Acesse seu repositório no GitHub**
   - Vá para: `https://github.com/SEU-USUARIO/Projeto_Angular_Consultores`

2. **Vá em Settings**
   - Clique na aba **Settings** (no topo do repositório)

3. **Vá em Pages** (menu lateral esquerdo)
   - Role até encontrar **Pages** no menu lateral

4. **Configure a Source**
   - Em **Source**, selecione: **Deploy from a branch**
   - Em **Branch**, selecione: **gh-pages**
   - Em **Folder**, selecione: **/ (root)**
   - Clique em **Save**

5. **Aguarde alguns minutos**
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

