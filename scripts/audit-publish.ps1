# Audit local publish output before/after Netlify deploy
# Usage: powershell -ExecutionPolicy Bypass -File scripts/audit-publish.ps1

$ErrorActionPreference = "Stop"
$Root = Split-Path $PSScriptRoot -Parent
$Mvp = Join-Path $Root "apps\mvp"
$Next = Join-Path $Mvp ".next"

Write-Host "=== Smart Category Explorer - publish audit ===" -ForegroundColor Cyan
Write-Host "Root: $Root"
Write-Host "Publish dir (netlify.toml): apps/mvp/.next"
Write-Host ""

if (-not (Test-Path $Next)) {
  Write-Host "MISSING: apps/mvp/.next - run build first" -ForegroundColor Red
  Write-Host "  cd apps/mvp && npx prisma migrate deploy && npm run build"
  exit 1
}

$files = Get-ChildItem $Next -Recurse -File
$sizeMb = [math]::Round(($files | Measure-Object Length -Sum).Sum / 1MB, 2)
Write-Host "=== .next summary ==="
Write-Host "Files: $($files.Count)"
Write-Host "Size:  ${sizeMb} MB"
Write-Host ""

Write-Host "=== Top-level .next ==="
Get-ChildItem $Next | ForEach-Object { Write-Host "  $($_.Name)" }

Write-Host ""
Write-Host "=== App routes (server/app) ==="
$appDir = Join-Path $Next "server\app"
if (Test-Path $appDir) {
  Get-ChildItem $appDir -Directory | ForEach-Object { Write-Host "  /$($_.Name)" }
} else {
  Write-Host "  WARN: no server/app directory" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Prisma migrations (apps/mvp) ==="
$migrationsDir = Join-Path $Mvp "prisma\migrations"
if (Test-Path $migrationsDir) {
  Get-ChildItem $migrationsDir -Directory | ForEach-Object { Write-Host "  $($_.Name)" }
} else {
  Write-Host "  WARN: no prisma/migrations directory" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== dev.db in Next.js file traces (.nft.json) ==="
$nftFiles = Get-ChildItem (Join-Path $Next "server") -Filter "*.nft.json" -Recurse -ErrorAction SilentlyContinue
$nftWithDb = $nftFiles | Where-Object {
  (Select-String -Path $_.FullName -Pattern "dev\.db" -Quiet -ErrorAction SilentlyContinue)
}
if ($nftWithDb) {
  $nftWithDb | ForEach-Object {
    Write-Host "  WARN (legacy SQLite): $($_.FullName.Replace($Root, '.'))" -ForegroundColor Yellow
  }
} else {
  Write-Host "  OK: no dev.db in traces (expected for Postgres)"
}

Write-Host ""
Write-Host "=== Prisma Linux engine in traces ==="
$hasLinux = $false
foreach ($f in $nftFiles) {
  if (Select-String -Path $f.FullName -Pattern "rhel-openssl" -Quiet -ErrorAction SilentlyContinue) {
    $hasLinux = $true
    break
  }
}
if ($hasLinux) { Write-Host "  OK: libquery_engine-rhel-openssl present" }
else { Write-Host "  WARN: missing rhel engine" -ForegroundColor Yellow }

Write-Host ""
Write-Host "=== Netlify CLI (from repo root) ===" -ForegroundColor Cyan
Write-Host "  npm install -g netlify-cli"
Write-Host "  netlify login"
Write-Host "  netlify link"
Write-Host "  netlify deploy --build          # preview + file list"
Write-Host "  netlify deploy --build --prod   # production"
Write-Host '  netlify api getDeploy --data ''{"deploy_id": "DEPLOY_ID"}'''
