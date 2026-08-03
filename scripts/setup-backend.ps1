# Backend setup — Smart Category Explorer MVP
# Run from repo root: npm run backend:setup

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
$mvpDir = Join-Path $repoRoot "apps\mvp"

Write-Host "==> Blinkit Category Explorer — backend setup" -ForegroundColor Cyan
Set-Location $mvpDir

$envFile = Join-Path $mvpDir ".env"
$envExample = Join-Path $mvpDir ".env.example"
if (-not (Test-Path $envFile) -and (Test-Path $envExample)) {
  Copy-Item $envExample $envFile
  Write-Host "Created .env from .env.example"
}

Write-Host "==> Prisma migrate deploy"
npm run db:migrate:deploy

Write-Host "==> Seed demo users, orders, nudges"
npm run db:seed

Write-Host ""
Write-Host "Backend ready. Start dev server:" -ForegroundColor Green
Write-Host "  npm run dev"
Write-Host ""
Write-Host "API endpoints:" -ForegroundColor Green
Write-Host "  http://localhost:3000/api"
Write-Host "  http://localhost:3000/api/health"
Write-Host "  http://localhost:3000/api/research/questions"
Write-Host "  http://localhost:3000/api/workflows"
