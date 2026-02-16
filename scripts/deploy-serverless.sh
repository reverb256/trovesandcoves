#!/bin/bash

#!/bin/bash

# Troves & Coves Serverless Deployment
# Deploys frontend to GitHub Pages, backend to Vercel

set -e

echo "🚀 Starting Troves & Coves Serverless Deployment..."

if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run from project root."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building frontend for GitHub Pages..."
npm run build:github-pages

echo "📤 Deploying frontend to GitHub Pages..."
npm run deploy:github-pages

echo "🔧 Setting up serverless backend..."
npm run build:serverless

echo "📤 Deploying backend to Vercel..."
npm run deploy:serverless

echo "✅ Deployment completed successfully!"
echo ""
echo "📍 Deployment URLs:"
echo "   Frontend (GitHub Pages): https://reverb256.github.io/troves-coves"
echo "   Backend (Vercel): https://troves-coves-api.vercel.app"
echo ""
echo "🧪 Testing API connection..."
curl -s https://troves-coves-api.vercel.app/api/categories | head -c 100
echo ""
echo "✅ Serverless deployment complete!"