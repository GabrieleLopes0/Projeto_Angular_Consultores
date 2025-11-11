# Script para testar build de produção localmente
# Uso: .\testar-producao.ps1

Write-Host "`n🚀 Testando Build de Produção" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Verifica se está na pasta correta
if (-not (Test-Path "angular.json")) {
    Write-Host "❌ Execute este script na pasta consultores-app" -ForegroundColor Red
    exit
}

Write-Host "`n📦 Fazendo build de produção..." -ForegroundColor Yellow
npm run build:prod

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Erro no build!" -ForegroundColor Red
    exit
}

Write-Host "`n✅ Build concluído com sucesso!" -ForegroundColor Green
Write-Host "`n🌐 Iniciando servidor local..." -ForegroundColor Yellow
Write-Host "`nAcesse: http://localhost:8080" -ForegroundColor Cyan
Write-Host "Pressione Ctrl+C para parar o servidor`n" -ForegroundColor Yellow

# Verifica se http-server está instalado
$httpServerInstalled = Get-Command http-server -ErrorAction SilentlyContinue

if (-not $httpServerInstalled) {
    Write-Host "📥 Instalando http-server..." -ForegroundColor Yellow
    npm install -g http-server
}

# Inicia o servidor
cd dist/consultores-app/browser
Write-Host "`n✅ Servidor iniciado!" -ForegroundColor Green
Write-Host "`n🌐 Acesse: http://localhost:8080" -ForegroundColor Cyan
Write-Host "   (NÃO acesse /consultores diretamente)" -ForegroundColor Yellow
Write-Host "`nPressione Ctrl+C para parar o servidor`n" -ForegroundColor Yellow
http-server -p 8080 -c-1 --proxy http://localhost:8080?

