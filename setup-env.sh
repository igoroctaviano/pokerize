#!/bin/bash

echo "🔧 Setting up environment variables for Pokerize..."

# Check if .env already exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists. Do you want to overwrite it? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled."
        exit 1
    fi
fi

# Copy example file
cp env.example .env

echo "✅ Created .env file from env.example"
echo ""
echo "📝 Please edit .env file with your Firebase credentials:"
echo "   1. Go to Firebase Console: https://console.firebase.google.com/"
echo "   2. Select your project"
echo "   3. Go to Project Settings → General"
echo "   4. Scroll down to 'Your apps' section"
echo "   5. Copy the config values to your .env file"
echo ""
echo "🔐 For GitHub Actions deployment, add these as repository secrets:"
echo "   - VITE_FIREBASE_API_KEY"
echo "   - VITE_FIREBASE_AUTH_DOMAIN"
echo "   - VITE_FIREBASE_PROJECT_ID"
echo "   - VITE_FIREBASE_STORAGE_BUCKET"
echo "   - VITE_FIREBASE_MESSAGING_SENDER_ID"
echo "   - VITE_FIREBASE_APP_ID"
echo ""
echo "🚀 After setting up .env, run: yarn dev"
