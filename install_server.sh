#!/bin/bash

# Estrelar Landing Pages - Server Installation Script
# This script installs all required dependencies on your Vultr Ubuntu server
# Run with: bash install_server.sh

set -e  # Exit on any error

echo "🚀 Starting Estrelar server installation..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root or with sudo${NC}"
    exit 1
fi

# Update system packages
echo -e "${GREEN}[1/8] Updating system packages...${NC}"
apt update && apt upgrade -y

# Install Git
echo -e "${GREEN}[2/8] Installing Git...${NC}"
apt install git -y

# Install Docker
echo -e "${GREEN}[3/8] Installing Docker...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    echo -e "${GREEN}✓ Docker installed${NC}"
else
    echo -e "${YELLOW}✓ Docker already installed${NC}"
fi

# Install Docker Compose
echo -e "${GREEN}[4/8] Installing Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    echo -e "${GREEN}✓ Docker Compose installed${NC}"
else
    echo -e "${YELLOW}✓ Docker Compose already installed${NC}"
fi

# Install Nginx
echo -e "${GREEN}[5/8] Installing Nginx...${NC}"
if ! command -v nginx &> /dev/null; then
    apt install nginx -y
    systemctl enable nginx
    echo -e "${GREEN}✓ Nginx installed${NC}"
else
    echo -e "${YELLOW}✓ Nginx already installed${NC}"
fi

# Install Certbot
echo -e "${GREEN}[6/8] Installing Certbot (for SSL certificates)...${NC}"
if ! command -v certbot &> /dev/null; then
    apt install certbot python3-certbot-nginx -y
    echo -e "${GREEN}✓ Certbot installed${NC}"
else
    echo -e "${YELLOW}✓ Certbot already installed${NC}"
fi

# Configure Firewall
echo -e "${GREEN}[7/8] Configuring firewall (UFW)...${NC}"
if command -v ufw &> /dev/null; then
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    # Only enable if not already enabled
    if ! ufw status | grep -q "Status: active"; then
        echo "y" | ufw enable
    fi
    echo -e "${GREEN}✓ Firewall configured${NC}"
else
    echo -e "${YELLOW}⚠ UFW not found, skipping firewall setup${NC}"
fi

# Optional: Install Python and dependencies (for Python backend)
echo -e "${GREEN}[8/8] Installing Python dependencies (optional - for Flask backend)...${NC}"
read -p "Do you want to install Python backend dependencies? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    apt install python3 python3-pip -y
    
    # Check if backend_requirements.txt exists in current directory
    if [ -f "backend_requirements.txt" ]; then
        pip3 install -r backend_requirements.txt
        pip3 install gunicorn  # For production Flask deployment
        echo -e "${GREEN}✓ Python dependencies installed${NC}"
    else
        echo -e "${YELLOW}⚠ backend_requirements.txt not found. Skipping Python dependencies.${NC}"
        echo -e "${YELLOW}  You can install them later with: pip3 install flask flask-cors gunicorn${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Skipping Python backend installation${NC}"
fi

# Verification
echo ""
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}Installation Complete!${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""
echo "Verifying installations..."
echo ""

# Check installations
echo -n "Docker: "
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓ $(docker --version)${NC}"
else
    echo -e "${RED}✗ Not installed${NC}"
fi

echo -n "Docker Compose: "
if command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}✓ $(docker-compose --version)${NC}"
else
    echo -e "${RED}✗ Not installed${NC}"
fi

echo -n "Git: "
if command -v git &> /dev/null; then
    echo -e "${GREEN}✓ $(git --version)${NC}"
else
    echo -e "${RED}✗ Not installed${NC}"
fi

echo -n "Nginx: "
if command -v nginx &> /dev/null; then
    echo -e "${GREEN}✓ $(nginx -v 2>&1)${NC}"
else
    echo -e "${RED}✗ Not installed${NC}"
fi

echo -n "Certbot: "
if command -v certbot &> /dev/null; then
    echo -e "${GREEN}✓ $(certbot --version)${NC}"
else
    echo -e "${RED}✗ Not installed${NC}"
fi

echo ""
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${YELLOW}Next Steps:${NC}"
echo ""
echo "1. Clone or upload your project code to the server"
echo "2. Navigate to your project directory"
echo "3. If using Docker:"
echo "   docker-compose up -d --build"
echo ""
echo "4. If using direct Node.js:"
echo "   npm install"
echo "   npm run build"
echo "   npm start"
echo ""
echo "5. Configure Nginx reverse proxy"
echo "6. Set up DNS in Namecheap (point domain to this server's IP)"
echo "7. Run: certbot --nginx -d yourdomain.com -d www.yourdomain.com"
echo ""
echo -e "${GREEN}════════════════════════════════════════${NC}"

