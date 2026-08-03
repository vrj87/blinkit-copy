# Set Netlify production env from local apps/mvp/.env (does not print secrets)
param(
  [string]$SiteId = "",
  [switch]$Deploy
)

$ErrorActionPreference = "Stop"
$AppRoot = Join-Path $PSScriptRoot "..\apps\mvp"
$EnvFile = Join-Path $AppRoot ".env"

function Get-EnvValue([string]$Name) {
  if (-not (Test-Path $EnvFile)) { return $null }
  $line = Get-Content $EnvFile -ErrorAction SilentlyContinue | Where-Object { $_ -match "^\s*$Name\s*=" } | Select-Object -First 1
  if (-not $line) { return $null }
  $val = $line -replace "^\s*$Name\s*=\s*", ""
  return $val.Trim().Trim('"').Trim("'")
}

if (-not (Get-Command netlify -ErrorAction SilentlyContinue)) {
  Write-Host "Netlify CLI not found. Install: npm install -g netlify-cli"
  Write-Host "Or set GROQ_API_KEY manually in Netlify UI: Site configuration -> Environment variables"
  exit 1
}

Set-Location (Join-Path $PSScriptRoot "..")

if ($SiteId) {
  netlify link --id $SiteId 2>&1 | Out-Null
}

$vars = @{
  GROQ_API_KEY           = Get-EnvValue "GROQ_API_KEY"
  DATABASE_URL           = Get-EnvValue "DATABASE_URL"
  DIRECT_URL             = Get-EnvValue "DIRECT_URL"
  N8N_WEBHOOK_SECRET     = Get-EnvValue "N8N_WEBHOOK_SECRET"
  OPENAI_API_KEY         = Get-EnvValue "OPENAI_API_KEY"
  NEXT_PUBLIC_APP_URL    = Get-EnvValue "NEXT_PUBLIC_APP_URL"
}

foreach ($entry in $vars.GetEnumerator()) {
  $name = $entry.Key
  $value = $entry.Value
  if ([string]::IsNullOrWhiteSpace($value)) {
    Write-Host "Skip $name (empty)"
    continue
  }
  if ($name -eq "NEXT_PUBLIC_APP_URL" -and $value -match "localhost") {
    Write-Host "Skip $name (localhost — set production URL after first deploy)"
    continue
  }
  Write-Host "Setting $name on Netlify..."
  netlify env:set $name $value --context production --force 2>&1 | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Write-Warning "Failed to set $name"
  }
}

Write-Host "Done. Redeploy on Netlify for env changes to take effect."

if ($Deploy) {
  Write-Host "Triggering production deploy..."
  netlify deploy --prod --build
}
