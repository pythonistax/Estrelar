#!/bin/bash
# Quick Deploy Script - Update Server with Latest Git Changes
# Run this script on your server

echo "🚀 Starting server update..."
echo ""

# Navigate to project directory
cd /root/Estrelar

# Step 1: Stop current containers
echo "📦 Stopping current containers..."
docker-compose down

# Step 2: Pull latest code
echo "📥 Pulling latest code from Git..."
git pull origin main

# Step 3: Rebuild and start containers
echo "🔨 Rebuilding containers..."
docker-compose up -d --build

# Step 4: Restart Nginx
echo "🌐 Restarting Nginx..."
systemctl restart nginx

# Step 5: Check status
echo ""
echo "✅ Update complete! Checking status..."
echo ""
docker-compose ps

echo ""
echo "🎉 Done! Your website should now be live with the latest changes."
echo "Visit: http://65.20.96.127"
echo ""

