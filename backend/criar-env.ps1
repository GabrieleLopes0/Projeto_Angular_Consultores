

$envPath = Join-Path $PSScriptRoot ".env"

if (Test-Path $envPath) {
    Write-Host "Arquivo .env já existe!" -ForegroundColor Yellow
    $resposta = Read-Host "Deseja sobrescrever? (S/N)"
    if ($resposta -ne "S" -and $resposta -ne "s") {
        Write-Host "Cancelado." -ForegroundColor Yellow
        exit
    }
}

$conteudo = @"
# Configuração do Backend
PORT=3001

# MongoDB Local
MONGODB_URI=mongodb://localhost:27017/consultores
"@

try {
    $conteudo | Out-File -FilePath $envPath -Encoding UTF8
    Write-Host "Arquivo .env criado com sucesso!" -ForegroundColor Green
    Write-Host "Localização: $envPath" -ForegroundColor Cyan
} catch {
    Write-Host "Erro ao criar arquivo .env: $_" -ForegroundColor Red
}

