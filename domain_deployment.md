# Domain Deployment Tracking - Step by Step Guide

**Current Status**: Site running on IP address (65.20.96.127)  
**Target**: Switch to domain name with HTTPS  
**Server IP**: 65.20.96.127  
**Project Directory**: /root/Estrelar  

---

## 📋 Pre-Deployment Checklist

- [ ] Domain registered in Namecheap
- [ ] Server is running and accessible via IP
- [ ] Docker container is running
- [ ] Nginx is configured and working
- [ ] Certbot is installed on server

---

## 🌍 STEP 1: Configure DNS in Namecheap

**Status**: ⬜ Not Started | 🟡 In Progress | ✅ Complete

### Instructions:
1. Log into your Namecheap account
2. Go to **Domain List**
3. Click **Manage** next to your domain
4. Click **Advanced DNS** tab
5. Add/Edit these DNS records:

**A Record (Main Domain):**
- Type: `A Record`
- Host: `@`
- Value: `65.20.96.127`
- TTL: `Automatic` (or `300`)

**A Record (www subdomain):**
- Type: `A Record`
- Host: `www`
- Value: `65.20.96.127`
- TTL: `Automatic` (or `300`)

6. Click **Save All Changes** (green checkmark)

### Your Domain Name:
```
[Enter your domain here, e.g., yourdomain.com]
```

### Notes:
```
[Add any notes about DNS configuration here]
```

---

## ⏳ STEP 2: Wait for DNS Propagation

**Status**: ⬜ Not Started | 🟡 Waiting | ✅ Complete

### Instructions:
- DNS propagation usually takes **5-60 minutes**
- Do NOT proceed to Step 3 until DNS is fully propagated

### Verification Methods:

**Method 1: Online Check**
- Visit: https://www.whatsmydns.net
- Enter your domain: `[your-domain.com]`
- Should show: `65.20.96.127` in all locations

**Method 2: Server Check**
- SSH into server: `ssh root@65.20.96.127`
- Run: `ping [your-domain.com]`
- Should resolve to: `65.20.96.127`

**Method 3: Command Line (from local machine)**
- Run: `nslookup [your-domain.com]`
- Should show: `65.20.96.127`

### DNS Propagation Status:
- [ ] Checked at: `[timestamp]` - Status: `[Not propagated / Propagated]`
- [ ] Checked at: `[timestamp]` - Status: `[Not propagated / Propagated]`
- [ ] Checked at: `[timestamp]` - Status: `[Not propagated / Propagated]`

### Notes:
```
[Add notes about propagation timing here]
```

---

## 🔧 STEP 3: Update Nginx Configuration

**Status**: ⬜ Not Started | 🟡 In Progress | ✅ Complete

### Instructions:
1. SSH into server: `ssh root@65.20.96.127`
2. Edit Nginx config: `nano /etc/nginx/sites-available/estrelar`
3. Make these changes:
   - Change `server_name _;` to `server_name [your-domain.com] www.[your-domain.com];`
   - Change `listen 80 default_server;` to `listen 80;` (remove `default_server`)
4. Keep all other settings (proxy_pass, headers, timeouts, etc.)
5. Save and exit: `Ctrl+X`, then `Y`, then `Enter`

### Current Configuration (Before):
```
[Take a screenshot or note the current config]
```

### New Configuration (After):
```
[Note what was changed]
```

### Notes:
```
[Add any issues or notes here]
```

---

## ✅ STEP 4: Test and Reload Nginx

**Status**: ⬜ Not Started | 🟡 In Progress | ✅ Complete

### Instructions:
1. Test Nginx configuration: `nginx -t`
   - Should show: `syntax is ok` and `test is successful`
2. If test passes, reload Nginx: `systemctl reload nginx`
3. Check Nginx status: `systemctl status nginx`
4. Test domain via HTTP: `curl http://[your-domain.com]`

### Test Results:
- [ ] Nginx config test: `[Pass / Fail]`
- [ ] Nginx reload: `[Success / Failed]`
- [ ] Nginx status: `[Running / Stopped]`
- [ ] HTTP test: `[Working / Not working]`

### Error Messages (if any):
```
[Paste any error messages here]
```

### Notes:
```
[Add troubleshooting notes here]
```

---

## 🔒 STEP 5: Obtain SSL Certificate (HTTPS)

**Status**: ⬜ Not Started | 🟡 In Progress | ✅ Complete

### ⚠️ IMPORTANT: 
**Do NOT run this step until DNS is fully propagated!**

### Instructions:
1. SSH into server: `ssh root@65.20.96.127`
2. Run Certbot: `certbot --nginx -d [your-domain.com] -d www.[your-domain.com]`
3. Follow the prompts:
   - Enter your email address
   - Agree to terms (type `A` and press Enter)
   - Choose whether to share email (type `Y` or `N`)
   - Choose redirect HTTP to HTTPS (recommend option `2` for redirect)
4. Certbot will automatically configure Nginx for HTTPS

### Certbot Output:
```
[Paste certbot output here]
```

### Email Used:
```
[Enter the email address you used]
```

### Notes:
```
[Add any issues or notes here]
```

---

## 🔍 STEP 6: Verify SSL Certificate

**Status**: ⬜ Not Started | 🟡 In Progress | ✅ Complete

### Instructions:
1. Check certificate status: `certbot certificates`
2. Test auto-renewal: `certbot renew --dry-run`

### Certificate Status:
- [ ] Certificate obtained: `[Yes / No]`
- [ ] Certificate valid: `[Yes / No]`
- [ ] Auto-renewal test: `[Pass / Fail]`
- [ ] Expiration date: `[Date]`

### Certificate Details:
```
[Paste certificate details here]
```

### Notes:
```
[Add any notes here]
```

---

## 🧪 STEP 7: Final Testing and Verification

**Status**: ⬜ Not Started | 🟡 In Progress | ✅ Complete

### HTTP Testing:
- [ ] HTTP redirects to HTTPS: `[Working / Not working]`
- [ ] Test command: `curl -I http://[your-domain.com]`
- [ ] Result: `[Should show redirect to HTTPS]`

### HTTPS Testing:
- [ ] HTTPS works: `[Working / Not working]`
- [ ] Test command: `curl -I https://[your-domain.com]`
- [ ] Result: `[Should show 200 OK]`

### Browser Testing:
- [ ] https://[your-domain.com] - `[Working / Not working]`
- [ ] https://www.[your-domain.com] - `[Working / Not working]`
- [ ] SSL certificate shows as valid in browser: `[Yes / No]`
- [ ] No security warnings: `[Yes / No]`

### Application Testing:
- [ ] Quiz flow works: `[Working / Not working]`
- [ ] Email submission works: `[Working / Not working]`
- [ ] Mobile version works: `[Working / Not working]`
- [ ] All pages load correctly: `[Yes / No]`

### Test Results Log:
```
[Add detailed test results here]
```

### Issues Found:
```
[Document any issues here]
```

### Notes:
```
[Add final notes here]
```

---

## 📝 Deployment Summary

### Domain Information:
- **Domain Name**: `[Enter domain]`
- **Server IP**: `65.20.96.127`
- **SSL Certificate**: `[Obtained / Not obtained]`
- **SSL Expiration**: `[Date]`

### Deployment Date:
```
Started: [Date/Time]
Completed: [Date/Time]
```

### Final Status:
- [ ] DNS configured
- [ ] DNS propagated
- [ ] Nginx updated
- [ ] SSL certificate obtained
- [ ] HTTPS working
- [ ] All tests passed
- [ ] Site live on domain

### Issues Resolved:
```
[List any issues that were encountered and resolved]
```

### Next Steps:
```
[Any follow-up tasks or maintenance needed]
```

---

## 🔄 Rollback Plan (If Needed)

If something goes wrong and you need to rollback to IP access:

1. Edit Nginx config: `nano /etc/nginx/sites-available/estrelar`
2. Change back to:
   - `server_name _;`
   - `listen 80 default_server;`
3. Test: `nginx -t`
4. Reload: `systemctl reload nginx`
5. Site will be accessible via IP again

### Rollback Status:
- [ ] Rollback needed: `[Yes / No]`
- [ ] Rollback completed: `[Yes / No]`

---

## 📞 Quick Reference Commands

### Check DNS Propagation:
```bash
ping [your-domain.com]
nslookup [your-domain.com]
```

### View Nginx Config:
```bash
cat /etc/nginx/sites-available/estrelar
```

### Test Nginx Config:
```bash
nginx -t
```

### Reload Nginx:
```bash
systemctl reload nginx
```

### Check SSL Certificate:
```bash
certbot certificates
```

### Test Domain:
```bash
curl -I http://[your-domain.com]
curl -I https://[your-domain.com]
```

### Check Docker Status:
```bash
cd /root/Estrelar
docker-compose ps
```

### View Logs:
```bash
docker-compose logs -f
tail -f /var/log/nginx/error.log
```

---

## 🐛 Troubleshooting Log

### Issue 1:
**Description**: 
```
[Describe the issue]
```

**Solution**:
```
[How it was resolved]
```

**Date**: `[Date]`

---

### Issue 2:
**Description**: 
```
[Describe the issue]
```

**Solution**:
```
[How it was resolved]
```

**Date**: `[Date]`

---

**Last Updated**: `[Date/Time]`  
**Status**: `[In Progress / Complete / On Hold]`

