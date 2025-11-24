# Server Requirements for Estrelar Landing Pages Deployment

This document lists all software, tools, and configurations needed on your Vultr server to deploy and run the Estrelar Next.js application.

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

## 🔧 **Core Runtime Dependencies**

### **1. Node.js (REQUIRED)**
- **Version**: Node.js 20.x (LTS)
- **Purpose**: Runs the Next.js application
- **Installation Method**: 
  - Via NodeSource repository (recommended)
  - Or via Docker (includes Node.js 20)
- **Verification**: `node --version` should show v20.x.x

### **2. npm (REQUIRED)**
- **Version**: Comes with Node.js (npm 9.x or 10.x)
- **Purpose**: Package manager for installing Next.js dependencies
- **Verification**: `npm --version`

### **3. Git (REQUIRED)**
- **Purpose**: Clone/pull code from repository
- **Installation**: `apt install git -y`
- **Verification**: `git --version`

---

## 🐳 **Docker & Containerization (OPTIONAL but Recommended)**

### **4. Docker (OPTIONAL - Recommended)**
- **Version**: Latest stable
- **Purpose**: Containerizes the application for consistent deployment
- **Installation**: Via Docker's official installation script
- **Verification**: `docker --version`

### **5. Docker Compose (OPTIONAL - Recommended)**
- **Version**: Latest (v2.x)
- **Purpose**: Orchestrates multi-container deployments
- **Installation**: Via Docker Compose installation script
- **Verification**: `docker-compose --version`

**Note**: If using Docker, Node.js is included in the container, so you don't need to install Node.js separately on the host system.

---

## 🌐 **Web Server & Reverse Proxy**

### **6. Nginx (REQUIRED)**
- **Version**: Latest stable (1.18+)
- **Purpose**: 
  - Reverse proxy to forward requests to Next.js app
  - Serves static files efficiently
  - Handles SSL/HTTPS termination
- **Installation**: `apt install nginx -y`
- **Verification**: `nginx -v`
- **Status Check**: `systemctl status nginx`

---

## 🔒 **SSL Certificate & Security**

### **7. Certbot (REQUIRED for HTTPS)**
- **Version**: Latest
- **Purpose**: Obtains and renews Let's Encrypt SSL certificates
- **Installation**: `apt install certbot python3-certbot-nginx -y`
- **Verification**: `certbot --version`

### **8. UFW (Uncomplicated Firewall) (REQUIRED)**
- **Purpose**: Firewall management for server security
- **Installation**: Usually pre-installed on Ubuntu
- **Verification**: `ufw --version`
- **Configuration**: 
  - Allow SSH (port 22)
  - Allow HTTP (port 80)
  - Allow HTTPS (port 443)

---

## 🐍 **Python Backend (OPTIONAL)**

**Note**: The Next.js app has a built-in API route at `/api/save-email`. You can use either:
- **Option A**: Next.js API route (no Python needed)
- **Option B**: Separate Python Flask backend (if you prefer Python)

### **9. Python 3 (OPTIONAL - Only if using Python backend)**
- **Version**: Python 3.8+ (Python 3.10+ recommended)
- **Purpose**: Runs the Flask backend for email submissions
- **Installation**: Usually pre-installed on Ubuntu
- **Verification**: `python3 --version`

### **10. pip (OPTIONAL - Only if using Python backend)**
- **Purpose**: Python package manager
- **Installation**: `apt install python3-pip -y`
- **Verification**: `pip3 --version`

### **11. Python Dependencies (OPTIONAL - Only if using Python backend)**
From `backend_requirements.txt`:
- **flask** (3.0.0)
- **flask-cors** (4.0.0)
- **gunicorn** (for production Flask deployment)

**Optional Database Support** (if using PostgreSQL instead of SQLite):
- **psycopg2-binary** (2.9.9) - PostgreSQL adapter
- **sqlalchemy** (2.0.23) - ORM

### **12. PostgreSQL (OPTIONAL - Only if using PostgreSQL)**
- **Purpose**: Production database (alternative to SQLite)
- **Installation**: `apt install postgresql postgresql-contrib -y`
- **Note**: SQLite is built into Python, so no installation needed if using SQLite

---

## 📦 **Next.js Application Dependencies**

These are installed via `npm install` when you deploy the code. They're listed here for reference:

### **Production Dependencies** (from `package.json`):
- **next** (^14.0.4)
- **react** (^18.2.0)
- **react-dom** (^18.2.0)
- **typescript** (^5.3.3)
- **tailwindcss** (^3.4.0)
- **autoprefixer** (^10.4.16)
- **postcss** (^8.4.32)
- **framer-motion** (^10.16.16)
- **react-hot-toast** (^2.4.1)

### **Dev Dependencies** (only needed for building):
- **eslint** (^8.56.0)
- **eslint-config-next** (^14.0.4)

**Note**: These are automatically installed when you run `npm install` on the server.

---

## 🔌 **Port Requirements**

The following ports must be open and available:

- **Port 22**: SSH access (already open)
- **Port 80**: HTTP traffic (for Nginx)
- **Port 443**: HTTPS traffic (for Nginx)
- **Port 3000**: Next.js application (internal, not exposed directly)
- **Port 5000**: Python Flask backend (if using, internal, not exposed directly)

---

## 📁 **Directory Structure Requirements**

The server needs space for:
- Application code directory (e.g., `/root/estrelar` or `/var/www/estrelar`)
- Node.js `node_modules` directory (can be large, ~500MB-1GB)
- Next.js build output (`.next` directory)
- Log files
- Database files (if using SQLite or PostgreSQL)

**Minimum Space**: 5GB free space recommended
**Recommended Space**: 10GB+ free space

---

## 🔐 **Environment Variables**

The application may need these environment variables (create `.env` or `.env.local`):

- `NEXT_PUBLIC_API_ENDPOINT` - API endpoint URL (if using external Python backend)
- `NODE_ENV=production` - Production environment flag

---

## 🛠️ **Process Management (Choose One)**

### **Option A: Docker (Recommended)**
- Uses Docker Compose to manage the application
- Automatic restart on failure
- Isolated environment

### **Option B: PM2 (Alternative)**
- **PM2**: Process manager for Node.js
- **Installation**: `npm install -g pm2`
- **Purpose**: Keeps Next.js app running, auto-restart on crash

### **Option C: systemd (Alternative)**
- Built-in Linux service manager
- Create a systemd service file for the Next.js app

---

## 📊 **Monitoring & Logging (OPTIONAL but Recommended)**

### **13. Log Management**
- Application logs (Next.js output)
- Nginx access/error logs (`/var/log/nginx/`)
- System logs (`journalctl`)

### **14. Resource Monitoring (OPTIONAL)**
- `htop` or `top` - CPU/Memory monitoring
- `df -h` - Disk space monitoring
- `docker stats` - If using Docker

---

## ✅ **Installation Checklist**

Use this checklist when setting up your server:

### **Phase 1: System Setup**
- [ ] Update system packages (`apt update && apt upgrade -y`)
- [ ] Install Git (`apt install git -y`)
- [ ] Configure firewall (UFW) - allow ports 22, 80, 443

### **Phase 2: Runtime Installation**
**Choose ONE approach:**

**Option A: Docker Approach (Recommended)**
- [ ] Install Docker
- [ ] Install Docker Compose
- [ ] Verify Docker installation

**Option B: Direct Node.js Installation**
- [ ] Install Node.js 20.x
- [ ] Verify Node.js and npm installation
- [ ] (Optional) Install PM2 for process management

### **Phase 3: Web Server**
- [ ] Install Nginx
- [ ] Configure Nginx reverse proxy (after app is deployed)
- [ ] Test Nginx configuration

### **Phase 4: SSL Certificate**
- [ ] Install Certbot
- [ ] Configure DNS (point domain to server IP)
- [ ] Obtain SSL certificate (after DNS is configured)

### **Phase 5: Python Backend (OPTIONAL)**
- [ ] Install Python 3 and pip
- [ ] Install Python dependencies (`pip install -r backend_requirements.txt`)
- [ ] (Optional) Install PostgreSQL if using PostgreSQL
- [ ] (Optional) Install Gunicorn for production Flask deployment

---

## 🚀 **Quick Installation Commands Summary**

### **Minimal Setup (Docker Approach - Recommended)**
```bash
# System updates
apt update && apt upgrade -y

# Install Git
apt install git -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
rm get-docker.sh

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Install Nginx
apt install nginx -y

# Install Certbot
apt install certbot python3-certbot-nginx -y

# Configure Firewall
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### **Alternative Setup (Direct Node.js)**
```bash
# System updates
apt update && apt upgrade -y

# Install Git
apt install git -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install PM2 (process manager)
npm install -g pm2

# Install Nginx
apt install nginx -y

# Install Certbot
apt install certbot python3-certbot-nginx -y

# Configure Firewall
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

---

## 📝 **Notes**

1. **Docker vs Direct Installation**: Docker is recommended because it:
   - Includes all Node.js dependencies
   - Provides isolation
   - Makes deployment easier
   - Matches your existing `Dockerfile` and `docker-compose.yml`

2. **Python Backend**: Only install if you plan to use the separate Flask backend instead of the Next.js API route.

3. **Database**: 
   - SQLite is built into Python (no installation needed)
   - PostgreSQL requires separate installation if you want a more robust database

4. **Ports**: Ports 3000 and 5000 should NOT be exposed to the internet. Only Nginx (ports 80/443) should be publicly accessible.

5. **Domain Setup**: You'll need to configure DNS in Namecheap AFTER the server is set up and BEFORE obtaining SSL certificates.

---

## 🔍 **Verification Commands**

After installation, verify everything is working:

```bash
# Check Node.js (if installed directly)
node --version    # Should show v20.x.x
npm --version

# Check Docker
docker --version
docker-compose --version

# Check Nginx
nginx -v
systemctl status nginx

# Check Certbot
certbot --version

# Check Python (if using Python backend)
python3 --version
pip3 --version

# Check Git
git --version

# Check Firewall
ufw status
```

---

## 📚 **Next Steps After Installation**

1. Clone/upload your project code
2. Install application dependencies (`npm install`)
3. Build the application (`npm run build`)
4. Configure Nginx reverse proxy
5. Set up DNS in Namecheap
6. Obtain SSL certificate with Certbot
7. Start the application
8. Test the deployment

---

**Last Updated**: Based on project structure as of current date
**Project**: Estrelar Landing Pages (Next.js 14, TypeScript, Tailwind CSS)

