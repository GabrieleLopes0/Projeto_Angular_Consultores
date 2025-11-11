#!/bin/bash

# Script de deploy manual para GitHub Pages
# Uso: ./deploy.sh

echo "🚀 Iniciando deploy para GitHub Pages..."

# Nome do repositório (ajuste se necessário)
REPO_NAME=$(basename $(git rev-parse --show-toplevel))

echo "📦 Fazendo build de produção..."
cd consultores-app
npm run build -- --configuration production --base-href /$REPO_NAME/

echo "📤 Fazendo deploy..."
npx angular-cli-ghpages --dir=dist/consultores-app/browser --name="GitHub Actions" --email="actions@github.com"

echo "✅ Deploy concluído!"
echo "🌐 Acesse: https://$(git config user.name).github.io/$REPO_NAME/"

