# Troubleshooting ERR_EMPTY_RESPONSE

## Quick Diagnostic Steps

### 1. Check if Docker Container is Running
```bash
ssh root@65.20.96.127
cd /root/Estrelar
docker-compose ps
```

**Expected:** Should show container as "Up"

### 2. Check Container Logs for Errors
```bash
docker-compose logs -f
```

Look for any error messages or crashes.

### 3. Check if App Responds Locally
```bash
curl http://localhost:3000
```

**Expected:** Should return HTML content, not an error

### 4. Check if Nginx is Running
```bash
systemctl status nginx
```

**Expected:** Should show "active (running)"

### 5. Check Nginx Configuration
```bash
nginx -t
```

**Expected:** Should say "syntax is ok" and "test is successful"

### 6. Check if Ports are Open
```bash
netstat -tuln | grep :80
netstat -tuln | grep :3000
```

**Expected:** Should show ports are listening

---

## Common Fixes

### Fix 1: Restart Everything
```bash
cd /root/Estrelar
docker-compose down
docker-compose up -d
systemctl restart nginx
```

### Fix 2: Check Nginx Config
```bash
cat /etc/nginx/sites-available/estrelar
```

Make sure it has:
```nginx
proxy_pass http://localhost:3000;
```

### Fix 3: Check Firewall
```bash
ufw status
```

Make sure ports 80 and 443 are allowed:
```bash
ufw allow 80/tcp
ufw allow 443/tcp
```

### Fix 4: Rebuild Container
```bash
cd /root/Estrelar
docker-compose down
docker-compose up -d --build
```


