#!/bin/bash

# Estrelar Landing Pages - Minimal Server Installation Script (Docker Approach)
# This is the quickest way to get everything installed
# Run with: bash install_server_minimal.sh

set -e  # Exit on any error

echo "🚀 Installing Estrelar server dependencies (Docker approach)..."
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root or with sudo"
    exit 1
fi

# Update system
echo "[1/6] Updating system..."
apt update && apt upgrade -y

# Install Git
echo "[2/6] Installing Git..."
apt install git -y

# Install Docker
echo "[3/6] Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
rm get-docker.sh

# Install Docker Compose
echo "[4/6] Installing Docker Compose..."
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Install Nginx
echo "[5/6] Installing Nginx..."
apt install nginx -y
systemctl enable nginx

# Install Certbot
echo "[6/6] Installing Certbot..."
apt install certbot python3-certbot-nginx -y

# Configure Firewall
echo "Configuring firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
echo "y" | ufw enable

echo ""
echo "✅ Installation complete!"
echo ""
echo "Verify with:"
echo "  docker --version"
echo "  docker-compose --version"
echo "  nginx -v"
echo "  certbot --version"

