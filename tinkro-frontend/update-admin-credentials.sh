#!/bin/bash

# 🔐 Tinkro Admin Credentials Updater Script
# This script helps you quickly update admin credentials

echo "🔐 Tinkro Admin Credentials Updater"
echo "=================================="
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "Please run this script from the project root directory."
    exit 1
fi

# Show current credentials
echo "📋 Current credentials in .env file:"
echo "Username: $(grep VITE_ADMIN_USERNAME .env | cut -d'=' -f2)"
echo "Password: $(grep VITE_ADMIN_PASSWORD .env | cut -d'=' -f2)"
echo ""

# Get new credentials from user
read -p "🆔 Enter new admin username: " new_username
echo ""
read -s -p "🔒 Enter new admin password: " new_password
echo ""
echo ""

# Validate inputs
if [ -z "$new_username" ] || [ -z "$new_password" ]; then
    echo "❌ Username and password cannot be empty!"
    exit 1
fi

# Create backup of current .env
cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
echo "📦 Backup created: .env.backup.$(date +%Y%m%d_%H%M%S)"

# Update credentials in .env file
sed -i.tmp "s/^VITE_ADMIN_USERNAME=.*/VITE_ADMIN_USERNAME=$new_username/" .env
sed -i.tmp "s/^VITE_ADMIN_PASSWORD=.*/VITE_ADMIN_PASSWORD=$new_password/" .env
rm .env.tmp

echo ""
echo "✅ Credentials updated successfully!"
echo ""
echo "📋 New credentials:"
echo "Username: $new_username"
echo "Password: $new_password"
echo ""
echo "⚠️  Important reminders:"
echo "1. Restart your development server (npm run dev)"
echo "2. Clear browser localStorage if needed"
echo "3. Keep these credentials secure"
echo ""
echo "🚀 Ready to login with new credentials!"