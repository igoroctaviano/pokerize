#!/bin/bash

echo "🚀 Building Pokerize app..."
yarn build

echo "📦 Deploying to Firebase..."
firebase deploy --only hosting

echo "✅ Deployment complete!"
echo "🌐 Your app is live at: https://pokerize-app.web.app"
