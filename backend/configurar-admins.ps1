# Script para configurar os 2 administradores
# Uso: .\configurar-admins.ps1

Write-Host ""
Write-Host "Configurando Administradores" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

$admins = @(
    "gabriele@gmail.com",
    "giovanna@gmail.com"
)

Write-Host ""
Write-Host "Administradores a configurar:" -ForegroundColor Yellow
foreach ($admin in $admins) {
    Write-Host "  - $admin" -ForegroundColor White
}

Write-Host ""
Write-Host "IMPORTANTE:" -ForegroundColor Yellow
Write-Host "  1. Certifique-se de que os usuarios ja existem no Firebase Authentication" -ForegroundColor White
Write-Host "  2. Se nao existirem, crie-os primeiro via:" -ForegroundColor White
Write-Host "     - Aplicacao web (tela de login -> Criar conta)" -ForegroundColor Gray
Write-Host "     - Firebase Console" -ForegroundColor Gray
Write-Host ""
Write-Host "  3. Apos executar este script, os usuarios precisarao fazer logout e login novamente" -ForegroundColor White

$confirm = Read-Host "`nDeseja continuar? (S/N)"
if ($confirm -ne "S" -and $confirm -ne "s") {
    Write-Host ""
    Write-Host "Operacao cancelada" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "Configurando roles..." -ForegroundColor Green

foreach ($admin in $admins) {
    Write-Host ""
    Write-Host "Configurando: $admin" -ForegroundColor Cyan
    node set-admin-role.js $admin admin
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "OK: $admin configurado como admin" -ForegroundColor Green
    } else {
        Write-Host "ERRO: Falha ao configurar $admin" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Concluido!" -ForegroundColor Green
Write-Host ""
Write-Host "Proximos passos:" -ForegroundColor Yellow
Write-Host "  1. Faca logout e login novamente com cada conta admin" -ForegroundColor White
Write-Host "  2. Verifique se os botoes de admin aparecem corretamente" -ForegroundColor White
Write-Host ""

