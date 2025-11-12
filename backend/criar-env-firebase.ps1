

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

# Firebase Admin SDK
FIREBASE_PROJECT_ID=consultores-app-5f8f4
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDEX60YXxKXZhPb\n99S4QvLHVxLuTih/r0L0if5txyIr4wqWuRgNZ4dbC3ux4MHoQaauYp8V6SixKDoa\nlx/SvXNp70+zq4PdSaqGN3LahNTGjeBq6inraD1yAFXcmAxI9+Xs6TMQecgZdwbL\nG6BEqWffMvLOpLx6vduV6zDbmLGUCz00dQaKQ5XGU6Ca3sou07//iPKkit944G1y\nkSUVxuLZzoT4xWs4kKAogYsTv2Y70ln39O+N7uNtbNpwq1p4RHaTnuDg2QzlH/9W\nQ+e7Wb6ct0sfmq05wrkk4ZALzDSG8IoZZ4gdiYF3svDzhTFaO+y1kuXsoFHi1N4S\naB8zVspbAgMBAAECggEAWx0pa01xit3KCR4MjRJDI0q7dea908C2CFCexMDIkiRe\nHWD0UAPhQdUqJ3ZpgiIz/GW1+qycPNa1XvEPyvAsRNLM4EiMfnhXrr67g7huIVJi\n9jiACsHrAKI3NIs36ANdo3bwQoy+01HuzP6cdj9D+sPg9RBqg2jkIcNmf/1xJ4bf\nXaEXivDyF/eJ23hNU9vYiKfupc4lJOg0keToR5nTmzoC8N1O6YfVH5G9SN46eN6w\nmIfynBK5rNI8Vg49IWbK4DRoy00mba0t+iAHQjr2iwqWyHZY0DAMG2r0aJ0QV/8/\nhvv8a6BOJY6IPAwZr0U8qCOEVkOYQsrgCRvx/9C7wQKBgQDkUo3bibBMmyfFsEss\nw7kdAu3bjSCj9scPWJ+7d/eMk2r75vcwTLa99v2o3sOewt0sEhKHqXkhAnTQxaRK\nVRncU/COucwLwKsiClZrpDbo/kXlGegS62ivd3jswvn5CnvHPwt+/fZWYwaA1U5m\no33gMFOGV6c2vmoV31mpYvb4vwKBgQDcLasurC5I5Dy+q8mfmx1+6o1KBxNkf8Oe\nIllzeqKW0l0VzuybcdJ8f7gKH70MLYPiEVIuecyGrn0c7Yxj/fSvm3xn14blCIr9\n97BRkrS1pOYrVYhLuFq+FKpOZH1uBh/V/tWB9ClHLxpfde98jwO5TBC6oATnoe6y\nv5V44WQZZQKBgQCKK5tFO/HAqjRLYgBcOqWPdPJUZvdVwkV8d/lSDat1GtEnWAJG\n7GW6V/nxc72WGf6WaOllx51R6JagsLpXcWCRAQsWlEFy60mk8/SQd3PzU80gc6kJ\nqgRUC0zWmreDimCVlwVx+GZWqN6KoIstecr3HMevCORcMKcqTVuJMiabKQKBgQDR\nURlMZaQa5+BX5Djp4y1HWvS3S8LD6DKwQzeG8S9g8txLv0xw+uSAN2tfNI0k5qBa\nat0WEfS+lWOb/Lla1jOoPskmb19unZCFoNOeuTnS9dFboRTR55Fc44iEvkQANRJO\n/tU7lkMnyT/pQNVMNSn1HrtIsJf5HZkvlbMkGCJxgQKBgQC1BSL+56tYY4SWDDLx\nRkz1pSLBJgGMVx0QVfWPWU9osrp5wQgMK9doUqwARRm1swSQbUD81IJL3vcIW1YF\nSz6EwsrpVLxRL26d7plfCP5Usj9kf2g4IS4h5fGo/AxeRuYpboQR1c/dHKpWzDp1\nSk7iHGMS6erMolORLceSmprDdQ==\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@consultores-app-5f8f4.iam.gserviceaccount.com
"@

try {
    $conteudo | Out-File -FilePath $envPath -Encoding UTF8
    Write-Host "`n✅ Arquivo .env criado com sucesso!" -ForegroundColor Green
    Write-Host "Localização: $envPath" -ForegroundColor Cyan
    Write-Host "`n⚠️  IMPORTANTE: O arquivo .env contém credenciais sensíveis!" -ForegroundColor Yellow
    Write-Host "   Não compartilhe este arquivo publicamente." -ForegroundColor Yellow
    Write-Host "`n🔄 Reinicie o servidor backend para aplicar as configurações:" -ForegroundColor Cyan
    Write-Host "   npm start" -ForegroundColor White
} catch {
    Write-Host "❌ Erro ao criar arquivo .env: $_" -ForegroundColor Red
}

