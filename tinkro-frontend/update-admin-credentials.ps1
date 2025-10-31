# 🔐 Tinkro Admin Credentials Updater (PowerShell)
# Usage: .\update-admin-credentials.ps1

Write-Host "🔐 Tinkro Admin Credentials Updater" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
if (!(Test-Path ".env")) {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "Please run this script from the project root directory." -ForegroundColor Yellow
    exit 1
}

# Show current credentials
Write-Host "📋 Current credentials in .env file:" -ForegroundColor Green
$currentUsername = (Get-Content .env | Select-String "VITE_ADMIN_USERNAME" | ForEach-Object { $_.ToString().Split('=')[1] })
$currentPassword = (Get-Content .env | Select-String "VITE_ADMIN_PASSWORD" | ForEach-Object { $_.ToString().Split('=')[1] })

Write-Host "Username: $currentUsername" -ForegroundColor White
Write-Host "Password: $currentPassword" -ForegroundColor White
Write-Host ""

# Get new credentials from user
$newUsername = Read-Host "🆔 Enter new admin username"
$newPassword = Read-Host "🔒 Enter new admin password" -AsSecureString
$newPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($newPassword))

Write-Host ""

# Validate inputs
if ([string]::IsNullOrEmpty($newUsername) -or [string]::IsNullOrEmpty($newPasswordPlain)) {
    Write-Host "❌ Username and password cannot be empty!" -ForegroundColor Red
    exit 1
}

# Create backup of current .env
$backupName = ".env.backup." + (Get-Date -Format "yyyyMMdd_HHmmss")
Copy-Item .env $backupName
Write-Host "📦 Backup created: $backupName" -ForegroundColor Yellow

# Update credentials in .env file
$envContent = Get-Content .env
$envContent = $envContent -replace "^VITE_ADMIN_USERNAME=.*", "VITE_ADMIN_USERNAME=$newUsername"
$envContent = $envContent -replace "^VITE_ADMIN_PASSWORD=.*", "VITE_ADMIN_PASSWORD=$newPasswordPlain"
Set-Content .env $envContent

Write-Host ""
Write-Host "✅ Credentials updated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 New credentials:" -ForegroundColor Cyan
Write-Host "Username: $newUsername" -ForegroundColor White
Write-Host "Password: $newPasswordPlain" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Important reminders:" -ForegroundColor Yellow
Write-Host "1. Restart your development server (npm run dev)" -ForegroundColor White
Write-Host "2. Clear browser localStorage if needed" -ForegroundColor White
Write-Host "3. Keep these credentials secure" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Ready to login with new credentials!" -ForegroundColor Green

# Clear password from memory
$newPassword = $null
$newPasswordPlain = $null