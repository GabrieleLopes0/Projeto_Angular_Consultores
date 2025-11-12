
Write-Host "=== Verificação do MongoDB ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Verificando instalação..." -ForegroundColor Yellow
try {
    $mongodVersion = mongod --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✓ MongoDB está instalado" -ForegroundColor Green
        Write-Host "   $($mongodVersion | Select-Object -First 1)" -ForegroundColor Gray
    } else {
        Write-Host "   ✗ MongoDB não está instalado ou não está no PATH" -ForegroundColor Red
        Write-Host "   Instale o MongoDB: https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "   ✗ MongoDB não está instalado" -ForegroundColor Red
    Write-Host "   Instale o MongoDB: https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

Write-Host "2. Verificando serviço..." -ForegroundColor Yellow
try {
    $service = Get-Service -Name MongoDB -ErrorAction SilentlyContinue
    if ($service) {
        if ($service.Status -eq "Running") {
            Write-Host "   ✓ Serviço MongoDB está rodando" -ForegroundColor Green
        } else {
            Write-Host "   ✗ Serviço MongoDB não está rodando" -ForegroundColor Red
            Write-Host "   Iniciando serviço..." -ForegroundColor Yellow
            Start-Service MongoDB
            Start-Sleep -Seconds 2
            $service = Get-Service -Name MongoDB
            if ($service.Status -eq "Running") {
                Write-Host "   ✓ Serviço iniciado com sucesso!" -ForegroundColor Green
            } else {
                Write-Host "   ✗ Erro ao iniciar serviço" -ForegroundColor Red
                Write-Host "   Tente iniciar manualmente: Start-Service MongoDB" -ForegroundColor Yellow
            }
        }
    } else {
        Write-Host "   ⚠ Serviço MongoDB não encontrado" -ForegroundColor Yellow
        Write-Host "   O MongoDB pode estar rodando de outra forma" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ⚠ Não foi possível verificar o serviço" -ForegroundColor Yellow
}

Write-Host ""


Write-Host "3. Verificando arquivo .env..." -ForegroundColor Yellow
$envPath = Join-Path $PSScriptRoot ".env"
if (Test-Path $envPath) {
    $envContent = Get-Content $envPath
    Write-Host "   ✓ Arquivo .env existe" -ForegroundColor Green
    $mongoUri = $envContent | Select-String "MONGODB_URI"
    if ($mongoUri) {
        Write-Host "   $mongoUri" -ForegroundColor Gray
    }
} else {
    Write-Host "   ✗ Arquivo .env não encontrado" -ForegroundColor Red
    Write-Host "   Execute: .\criar-env.ps1" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Verificação Concluída ===" -ForegroundColor Cyan

