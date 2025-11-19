#!/bin/bash

# Estrelar Landing Pages - Deployment Script for Vultr
# This script helps deploy the landing page to your Vultr server

set -e

echo "🚀 Estrelar Landing Pages Deployment Script"
echo "============================================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Installing..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Installing..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# Build and start containers
echo "📦 Building Docker image..."
docker-compose build

echo "🚀 Starting containers..."
docker-compose up -d

echo "✅ Deployment complete!"
echo ""
echo "Your landing page should be available at: http://localhost:3000"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down"
echo "To restart: docker-compose restart"

