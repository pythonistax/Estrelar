# Estrelar Deployment Steps - Complete Guide

This guide walks you through deploying your Estrelar landing pages to your Vultr server step by step.

**Prerequisites**: You have a Vultr server running Ubuntu 22.04 with SSH access.
---

## 📋 **System Requirements**

### **Operating System**
- **Ubuntu 22.04 LTS** (recommended) or Ubuntu 20.04 LTS
- Minimum: 1 CPU, 1GB RAM, 25GB storage
- Recommended: 2 CPU, 2GB RAM, 50GB storage

### **Initial System Setup**
- SSH access configured
- Root or sudo user access
- System packages updated (`apt update && apt upgrade -y`)

---



---

## 📋 **Phase 1: Server Software Installation**

### Step 1.1: Install All Required Software

You have two options:

**Option A: Use the installation script (Easiest)**
```bash
# Transfer the script to your server
# From your local machine:
scp install_server_minimal.sh root@65.20.96.127:/root/

# SSH into server
ssh root@65.20.96.127

# Run the installation script
bash install_server_minimal.sh
```

**Option B: Manual installation**
Follow the installation commands in the `install_server_minimal.sh` script or install manually:
```bash
apt update && apt upgrade -y
apt install git -y
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
rm get-docker.sh
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
apt install nginx -y
apt install certbot python3-certbot-nginx -y
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### Step 1.2: Verify Installation
```bash
docker --version
docker-compose --version
nginx -v
certbot --version
git --version
```

---

## 📦 **Phase 2: Deploy Your Code to Server**

### Step 2.1: Choose Deployment Method

**Method A: Git Repository (Recommended)**
```bash
# On your server
cd /root
git clone <your-git-repository-url>
cd estrelar  # or whatever your project folder is named
```

**Method B: Direct File Transfer (SCP)**
```bash
# From your local machine
scp -r . root@65.20.96.127:/root/estrelar
```

**Method C: Zip and Transfer**
```bash
# On your local machine - create zip
zip -r estrelar.zip . -x "node_modules/*" ".next/*" ".git/*"

# Transfer to server
scp estrelar.zip root@65.20.96.127:/root/

# On server - extract
cd /root
unzip estrelar.zip -d estrelar
cd estrelar
```

### Step 2.2: Navigate to Project Directory
```bash
ssh root@65.20.96.127
cd /root/estrelar  # or wherever you put the project
```

---

## 🔧 **Phase 3: Build and Configure Application**

### Step 3.1: Install Node.js Dependencies
```bash
# If using Docker (recommended), skip this - Docker handles it
# If NOT using Docker:
npm install
```

### Step 3.2: Set Up Environment Variables
```bash
# Create .env file for production
nano .env
```

Add these variables (if needed):
```
NODE_ENV=production
NEXT_PUBLIC_API_ENDPOINT=/api/save-email
```

Save and exit (Ctrl+X, then Y, then Enter)

### Step 3.3: Build the Application

**If using Docker:**
```bash
# Build and start with Docker
docker-compose up -d --build

# Check if it's running
docker-compose ps
docker-compose logs -f
```

**If NOT using Docker:**
```bash
# Build the application
npm run build

# Test the build works
npm start
# (Press Ctrl+C to stop after testing)
```

---

## 🌐 **Phase 4: Configure Nginx Reverse Proxy**

### Step 4.1: Create Nginx Configuration File
```bash
nano /etc/nginx/sites-available/estrelar
```

**Option A: For Testing with IP Address (Use This Now)**
Paste this configuration to access via IP address:
```nginx
server {
    listen 80 default_server;
    server_name _;

    # Increase body size limit for file uploads if needed
    client_max_body_size 10M;

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
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

**Option B: For Production with Domain (Use This Later)**
When you have your domain ready, replace the config with:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Increase body size limit for file uploads if needed
    client_max_body_size 10M;

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
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

**For now, use Option A** (IP address testing). Save and exit (Ctrl+X, Y, Enter)

### Step 4.2: Enable the Site
```bash
# Create symbolic link
ln -s /etc/nginx/sites-available/estrelar /etc/nginx/sites-enabled/

# Remove default site (optional)
rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# If test passes, restart Nginx
systemctl restart nginx
```

### Step 4.3: Verify Nginx is Running
```bash
systemctl status nginx
```

---

## 🌍 **Phase 5: Configure DNS in Namecheap**

### Step 5.1: Your Server IP Address
Your server IP address is: **65.20.96.127**

### Step 5.2: Configure DNS in Namecheap

1. Log into your Namecheap account
2. Go to **Domain List**
3. Click **Manage** next to your domain
4. Go to **Advanced DNS** tab
5. Add/Edit these records:

**A Record (Main Domain):**
- Type: `A Record`
- Host: `@`
- Value: `65.20.96.127`
- TTL: `Automatic` or `300`

**A Record (www subdomain):**
- Type: `A Record`
- Host: `www`
- Value: `65.20.96.127`
- TTL: `Automatic` or `300`

6. Click **Save All Changes**

### Step 5.3: Wait for DNS Propagation
- Usually takes 5-60 minutes
- Check propagation: https://www.whatsmydns.net
- Test: `ping yourdomain.com` (should show 65.20.96.127)

---

## 🔒 **Phase 6: Set Up SSL Certificate (HTTPS)**

### Step 6.1: Obtain SSL Certificate
```bash
# Make sure DNS is pointing to your server first!
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts:
- Enter your email address
- Agree to terms (A)
- Choose whether to redirect HTTP to HTTPS (recommend: 2 for redirect)

### Step 6.2: Verify SSL Certificate
```bash
# Check certificate status
certbot certificates

# Test auto-renewal
certbot renew --dry-run
```

### Step 6.3: Test HTTPS
Visit: `https://yourdomain.com` - should show secure connection

**Note:** Skip Phase 5 and Phase 6 if you're testing with IP address. You can add SSL and domain later.

---

## 🔄 **Switching from IP Address to Domain (When Ready)**

When your partner is available and you want to use the real domain:

1. **Update Nginx Configuration:**
   ```bash
   nano /etc/nginx/sites-available/estrelar
   ```
   - Change `server_name _;` to `server_name yourdomain.com www.yourdomain.com;`
   - Remove `default_server` from `listen 80;`
   - Save and exit

2. **Test and Reload Nginx:**
   ```bash
   nginx -t
   systemctl reload nginx
   ```

3. **Configure DNS in Namecheap** (Phase 5)

4. **Get SSL Certificate** (Phase 6)

5. **Test the domain** - Your site will now be accessible via the domain!

---

## 🗄️ **Phase 7: Database Setup (If Using SQLite)**

### Step 7.1: Create Database Directory
```bash
# Create directory for database (if needed)
mkdir -p /root/estrelar/data
chmod 755 /root/estrelar/data
```

### Step 7.2: Ensure Database File Permissions
```bash
# If database file exists, ensure it's writable
chmod 664 /root/estrelar/data/*.db  # or wherever your DB file is
chown root:root /root/estrelar/data/*.db
```

### Step 7.3: Test Database Connection
```bash
# If using Docker, database should work automatically
# If not, test that the app can write to the database
```

---

## 🚀 **Phase 8: Start the Application**

### Step 8.1: Start with Docker (Recommended)
```bash
cd /root/estrelar
docker-compose up -d

# Check status
docker-compose ps
docker-compose logs -f
```

### Step 8.2: Start with PM2 (If NOT using Docker)
```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start npm --name "estrelar" -- start

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
```

### Step 8.3: Start with systemd (Alternative)
Create a systemd service file (if not using Docker or PM2):
```bash
nano /etc/systemd/system/estrelar.service
```

Paste:
```ini
[Unit]
Description=Estrelar Next.js App
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/estrelar
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Then:
```bash
systemctl daemon-reload
systemctl enable estrelar
systemctl start estrelar
systemctl status estrelar
```

---

## ✅ **Phase 9: Testing and Verification**

### Step 9.1: Test Application is Running
```bash
# Check if app responds locally
curl http://localhost:3000

# Check Docker containers (if using Docker)
docker-compose ps
```

### Step 9.2: Test from Browser

**If using IP address (testing):**
- Visit: `http://65.20.96.127` (should show your site)
- Test the quiz flow
- Test email submission
- Test on mobile device

**If using domain (production):**
- Visit: `http://yourdomain.com` (should redirect to HTTPS after SSL setup)
- Visit: `https://yourdomain.com` (should show your site)
- Test the quiz flow
- Test email submission
- Test on mobile device

### Step 9.3: Check Logs
```bash
# Docker logs
docker-compose logs -f

# PM2 logs
pm2 logs estrelar

# systemd logs
journalctl -u estrelar -f

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

## 🔄 **Phase 10: Ongoing Maintenance**

### Step 10.1: Update Your Application
```bash
cd /root/estrelar

# If using Git:
git pull origin main

# Rebuild
docker-compose up -d --build
# OR
npm run build && pm2 restart estrelar
```

### Step 10.2: Backup Database
```bash
# Backup SQLite database
cp /root/estrelar/data/*.db /root/backups/backup-$(date +%Y%m%d).db
```

### Step 10.3: Monitor Resources
```bash
# Check disk space
df -h

# Check memory
free -h

# Check running processes
htop
# OR
docker stats  # if using Docker
```

---

## 🐛 **Troubleshooting**

### Application Not Starting
```bash
# Check logs
docker-compose logs
# OR
pm2 logs estrelar

# Check if port 3000 is in use
netstat -tulpn | grep 3000
```

### Nginx 502 Bad Gateway
```bash
# Check if app is running
docker-compose ps
# OR
pm2 list

# Check Nginx error logs
tail -f /var/log/nginx/error.log

# Restart Nginx
systemctl restart nginx
```

### SSL Certificate Issues
```bash
# Check certificate
certbot certificates

# Renew manually
certbot renew

# Check Nginx SSL configuration
nginx -t
```

### Database Issues
```bash
# Check file permissions
ls -la /root/estrelar/data/

# Check if database file exists
ls -la *.db
```

---

## 📝 **Quick Reference Commands**

```bash
# Start application
docker-compose up -d
# OR
pm2 start estrelar

# Stop application
docker-compose down
# OR
pm2 stop estrelar

# View logs
docker-compose logs -f
# OR
pm2 logs estrelar

# Restart application
docker-compose restart
# OR
pm2 restart estrelar

# Check status
docker-compose ps
# OR
pm2 status

# Restart Nginx
systemctl restart nginx

# Check Nginx config
nginx -t
```

---

## ✅ **Deployment Checklist**

Use this to track your progress:

- [ ] Server software installed (Docker, Nginx, Certbot)
- [ ] Code deployed to server
- [ ] Application built successfully
- [ ] Environment variables configured
- [ ] Nginx reverse proxy configured
- [ ] Nginx configuration tested and enabled
- [ ] DNS configured in Namecheap
- [ ] DNS propagated (verified with ping/whatsmydns)
- [ ] SSL certificate obtained
- [ ] Application started and running
- [ ] Website accessible via HTTPS
- [ ] Quiz flow tested
- [ ] Email submission tested
- [ ] Mobile version tested
- [ ] Database working correctly
- [ ] Logs checked for errors

---

**Last Updated**: Based on current project structure
**Next Steps After Deployment**: Monitor logs, set up backups, configure monitoring

