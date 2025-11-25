# Quick Server Update Guide

## 🚀 Update Server with Latest Git Changes

### Step 1: SSH into Your Server
```bash
ssh root@65.20.96.127
```

### Step 2: Navigate to Project Directory
```bash
cd /root/Estrelar
```

### Step 3: Pull Latest Code from Git
```bash
git pull origin main
```

**Note:** If you get authentication errors, you may need to:
- Check if you're using SSH keys or HTTPS
- If using HTTPS, you might need to enter credentials
- If using SSH, ensure your SSH key is set up

### Step 4: Rebuild and Restart Docker Container
```bash
docker-compose up -d --build
```

This command will:
- Pull any updated base images
- Rebuild your application with the latest code
- Restart the container in detached mode (-d)

### Step 5: Verify Everything is Running
```bash
# Check container status
docker-compose ps

# View logs to ensure no errors
docker-compose logs -f
# (Press Ctrl+C to exit log view)
```

### Step 6: Test the Website
Visit: `http://65.20.96.127` (or your domain if configured)

---

## 🔄 One-Liner Quick Update (All Steps Combined)

If you're already SSH'd into the server:
```bash
cd /root/Estrelar && git pull origin main && docker-compose up -d --build
```

---

## 🐛 Troubleshooting

### If git pull fails:
```bash
# Check current branch
git branch

# Check git status
git status

# If you have local changes that conflict:
git stash
git pull origin main
git stash pop
```

### If Docker build fails:
```bash
# View detailed build logs
docker-compose build --no-cache

# Check for errors in logs
docker-compose logs landing-page
```

### If container won't start:
```bash
# Stop everything first
docker-compose down

# Rebuild from scratch
docker-compose up -d --build

# Check logs
docker-compose logs -f
```

### If changes aren't showing:
```bash
# Force rebuild without cache
docker-compose build --no-cache
docker-compose up -d

# Clear Next.js cache (if needed)
docker-compose exec landing-page rm -rf .next
docker-compose restart
```

---

## ✅ Verification Checklist

After updating, verify:
- [ ] `docker-compose ps` shows container as "Up"
- [ ] `docker-compose logs` shows no errors
- [ ] Website loads at http://65.20.96.127
- [ ] Quiz flow works correctly
- [ ] New changes are visible

---

## 📝 Quick Reference

```bash
# Full update workflow
cd /root/Estrelar
git pull origin main
docker-compose up -d --build
docker-compose logs -f

# Check status
docker-compose ps
systemctl status nginx

# Restart Nginx if needed
systemctl restart nginx
```

