# 🚀 Server Update - Complete Commands

## Copy and paste these commands one by one into your SSH session

---

## Step 1: SSH into Your Server
```bash
ssh root@65.20.96.127
```

---

## Step 2: Stop the Current Website
```bash
cd /root/Estrelar && docker-compose down
```

---

## Step 3: Pull Latest Code from Git
```bash
cd /root/Estrelar && git pull origin main
```

---

## Step 4: Rebuild and Start Docker Container
```bash
cd /root/Estrelar && docker-compose up -d --build
```

---

## Step 5: Restart Nginx (if needed)
```bash
systemctl restart nginx
```

---

## Step 6: Verify Everything is Running
```bash
docker-compose ps
```

---

## Step 7: Check Logs (Optional - to see if there are any errors)
```bash
docker-compose logs -f
```
(Press Ctrl+C to exit logs)

---

## ✅ All-in-One Command (Copy this entire block)
```bash
cd /root/Estrelar && docker-compose down && git pull origin main && docker-compose up -d --build && systemctl restart nginx && docker-compose ps
```

---

## 🔍 Verification Commands

### Check if container is running:
```bash
docker-compose ps
```

### Check if website is accessible:
```bash
curl http://localhost:3000
```

### Check Nginx status:
```bash
systemctl status nginx
```

### View recent logs:
```bash
docker-compose logs --tail=50
```

---

## 🌐 Test Your Website

After running the commands, visit:
- **http://65.20.96.127** (or your domain if configured)

---

## 🐛 If Something Goes Wrong

### Restart everything:
```bash
cd /root/Estrelar && docker-compose down && docker-compose up -d --build && systemctl restart nginx
```

### Check for errors:
```bash
docker-compose logs
```

### Force rebuild (if needed):
```bash
cd /root/Estrelar && docker-compose down && docker-compose build --no-cache && docker-compose up -d
```

