# Deployment Guide for Vultr

This guide walks you through deploying your Estrelar landing pages to Vultr.

## Prerequisites

- Vultr server (Ubuntu 20.04+ recommended)
- SSH access to your server
- Domain name (optional but recommended)

## Step-by-Step Deployment

### 1. Connect to Your Vultr Server

```bash
ssh root@your-server-ip
```

### 2. Update System Packages

```bash
apt update && apt upgrade -y
```

### 3. Install Docker and Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
rm get-docker.sh

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### 4. Upload Your Project

**Option A: Using Git (Recommended)**

```bash
# Install Git if not already installed
apt install git -y

# Clone your repository
git clone <your-repo-url>
cd estrelar-landing-pages
```

**Option B: Using SCP (from your local machine)**

```bash
# From your local machine
scp -r . root@your-server-ip:/root/estrelar-landing-pages
```

### 5. Configure Environment Variables (if needed)

```bash
# Create .env file if you have environment variables
nano .env
```

### 6. Build and Deploy

```bash
# Build and start containers
docker-compose up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### 7. Set Up Nginx Reverse Proxy (Recommended)

```bash
# Install Nginx
apt install nginx -y

# Create Nginx configuration
nano /etc/nginx/sites-available/landing-page
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
ln -s /etc/nginx/sites-available/landing-page /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default  # Remove default site
nginx -t  # Test configuration
systemctl restart nginx
```

### 8. Set Up SSL with Let's Encrypt (Recommended)

```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal is set up automatically
```

### 9. Configure Firewall

```bash
# Allow HTTP, HTTPS, and SSH
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

## Managing Your Deployment

### View Logs

```bash
docker-compose logs -f landing-page
```

### Restart Services

```bash
docker-compose restart
```

### Update Application

```bash
# Pull latest changes (if using Git)
git pull

# Rebuild and restart
docker-compose up -d --build
```

### Stop Services

```bash
docker-compose down
```

### Start Services

```bash
docker-compose up -d
```

## Monitoring

### Check Container Status

```bash
docker-compose ps
```

### Check Resource Usage

```bash
docker stats
```

### Set Up Monitoring (Optional)

Consider setting up:
- **PM2** for process management (if not using Docker)
- **Uptime monitoring** (UptimeRobot, Pingdom)
- **Server monitoring** (New Relic, Datadog)

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs landing-page

# Check if port 3000 is already in use
netstat -tulpn | grep 3000
```

### Nginx 502 Bad Gateway

- Verify Docker container is running: `docker-compose ps`
- Check Nginx error logs: `tail -f /var/log/nginx/error.log`
- Verify proxy_pass URL matches your container port

### Out of Memory

```bash
# Check memory usage
free -h

# Consider upgrading your Vultr instance
```

## Multiple Landing Pages

To host multiple landing pages on the same server:

1. Create separate directories for each offer
2. Use different ports in `docker-compose.yml`
3. Configure Nginx with multiple server blocks
4. Use subdomains or paths for routing

Example Nginx config for multiple sites:

```nginx
# Landing page 1
server {
    listen 80;
    server_name offer1.your-domain.com;
    location / {
        proxy_pass http://localhost:3000;
        # ... rest of config
    }
}

# Landing page 2
server {
    listen 80;
    server_name offer2.your-domain.com;
    location / {
        proxy_pass http://localhost:3001;
        # ... rest of config
    }
}
```

## Backup Strategy

```bash
# Backup your config files
tar -czf backup-$(date +%Y%m%d).tar.gz config/

# Backup Docker volumes (if using)
docker run --rm -v estrelar-landing-pages_data:/data -v $(pwd):/backup ubuntu tar czf /backup/data-backup.tar.gz /data
```

## Next Steps

- Set up CI/CD pipeline (GitHub Actions, GitLab CI)
- Configure analytics tracking
- Set up A/B testing framework
- Implement monitoring and alerting

