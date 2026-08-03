# Set Vercel production env from local .env (run from repo root)
# Does not print secret values.

param(
  [string]$ProductionUrl = "",
  [switch]$Deploy
)

$ErrorActionPreference = "Stop"
$AppRoot = Join-Path $PSScriptRoot "..\apps\mvp"
Set-Location $AppRoot
$EnvFile = Join-Path $AppRoot ".env"

function Get-EnvValue([string]$Name) {
  if (-not (Test-Path $EnvFile)) { return $null }
  $line = Get-Content $EnvFile -ErrorAction SilentlyContinue | Where-Object { $_ -match "^\s*$Name\s*=" } | Select-Object -First 1
  if (-not $line) { return $null }
  $val = $line -replace "^\s*$Name\s*=\s*", ""
  $val = $val.Trim().Trim('"').Trim("'")
  return $val
}

function Add-VercelEnv([string]$Name, [string]$Value, [switch]$Sensitive) {
  if ([string]::IsNullOrWhiteSpace($Value)) {
    Write-Host "Skip $Name (empty)"
    return
  }
  Write-Host "Setting $Name in Vercel production..."
  $args = @("env", "add", $Name, "production", "--force", "--yes", "--value", $Value)
  if ($Sensitive) { $args += "--sensitive" }
  & vercel @args 2>&1 | Out-Null
  if ($LASTEXITCODE -ne 0) {
    Write-Warning "Failed to set $Name (exit $LASTEXITCODE)"
  }
}

$webhookSecret = Get-EnvValue "N8N_WEBHOOK_SECRET"
if ([string]::IsNullOrWhiteSpace($webhookSecret) -or $webhookSecret -eq "dev-secret-change-in-production") {
  $webhookSecret = "blinkit-mvp-webhook-prod"
}

Add-VercelEnv "DATABASE_URL" (Get-EnvValue "DATABASE_URL") -Sensitive
Add-VercelEnv "DIRECT_URL" (Get-EnvValue "DIRECT_URL") -Sensitive
Add-VercelEnv "GROQ_API_KEY" (Get-EnvValue "GROQ_API_KEY") -Sensitive
Add-VercelEnv "OPENAI_API_KEY" (Get-EnvValue "OPENAI_API_KEY") -Sensitive
Add-VercelEnv "N8N_WEBHOOK_SECRET" $webhookSecret -Sensitive

if ($ProductionUrl) {
  $url = $ProductionUrl.TrimEnd("/")
  Add-VercelEnv "NEXT_PUBLIC_APP_URL" $url
  Add-VercelEnv "NEXT_PUBLIC_COLLECT_URL" "$url/dashboard/discovery"
  $url | Set-Content (Join-Path $AppRoot ".env.production.url") -NoNewline
  Write-Host "Production URL saved: $url"
}

if ($Deploy) {
  Write-Host "Deploying to production..."
  $output = & vercel --prod --scope vrj87 --yes 2>&1 | Out-String
  Write-Host $output
  if ($output -match "(https://[a-zA-Z0-9\-]+\.vercel\.app)") {
    $deployed = $Matches[1]
    Write-Host "Deployed: $deployed"
    if (-not $ProductionUrl) {
      & $PSCommandPath -ProductionUrl $deployed
      Write-Host "Redeploying with public URL env vars..."
      & vercel --prod --scope vrj87 --yes 2>&1 | Out-Null
      & (Join-Path $PSScriptRoot "update-production-urls.ps1") -Url $deployed
    }
  }
}
