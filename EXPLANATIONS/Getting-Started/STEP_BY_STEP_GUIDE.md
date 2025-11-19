# Complete Step-by-Step Guide

## Part 1: Setting Up Your Local Machine (Windows)

### Step 1: Install Node.js

1. **Download Node.js:**
   - Go to: https://nodejs.org/
   - Download the **LTS version** (Long Term Support) - it will say something like "Recommended For Most Users"
   - Choose the Windows Installer (.msi file)

2. **Install Node.js:**
   - Double-click the downloaded file
   - Click "Next" through all the prompts (use default settings)
   - Make sure "Add to PATH" is checked (it should be by default)
   - Click "Install"
   - Wait for installation to complete
   - Click "Finish"

3. **Verify Installation:**
   - Open PowerShell (search for "PowerShell" in Windows Start menu)
   - Type these commands and press Enter after each:
     ```powershell
     node --version
     npm --version
     ```
   - You should see version numbers (like `v20.x.x` and `10.x.x`)
   - If you see "command not found", restart your computer and try again

### Step 2: Install Git (if you don't have it)

1. **Check if Git is installed:**
   - In PowerShell, type: `git --version`
   - If you see a version number, skip to Step 3
   - If you see an error, continue below

2. **Download Git:**
   - Go to: https://git-scm.com/download/win
   - Download will start automatically
   - Run the installer
   - Use all default settings
   - Click "Next" through everything

3. **Verify Git:**
   - Close and reopen PowerShell
   - Type: `git --version`
   - You should see a version number

---

## Part 2: Testing the Landing Page Locally

### Step 1: Open Your Project in PowerShell

1. **Navigate to your project folder:**
   - Open PowerShell
   - Type this command (replace with your actual path):
     ```powershell
     cd C:\Users\mmsou\Documents\Estrelar
     ```
   - Press Enter

2. **Verify you're in the right place:**
   - Type: `dir` (or `ls` if you prefer)
   - You should see files like `package.json`, `README.md`, etc.

### Step 2: Install Dependencies

**This is like `pip install -r requirements.txt` in Python**

1. **Run the install command:**
   ```powershell
   npm install
   ```

2. **What's happening:**
   - npm is downloading all the code libraries needed (like installing Python packages)
   - This will take 2-5 minutes
   - You'll see lots of text scrolling - this is normal
   - Wait until you see your prompt again (no errors)

3. **If you see errors:**
   - Make sure you're in the right folder
   - Make sure Node.js is installed correctly
   - Try: `npm cache clean --force` then `npm install` again

### Step 3: Start the Development Server

**This is like running `python app.py` - it starts a local web server**

1. **Run the dev server:**
   ```powershell
   npm run dev
   ```

2. **What you'll see:**
   - Text will appear saying something like:
     ```
     ▲ Next.js 14.0.4
     - Local:        http://localhost:3000
     ```
   - **Keep this window open!** The server is running.

3. **View your landing page:**
   - Open your web browser (Chrome, Firefox, Edge, etc.)
   - Go to: `http://localhost:3000`
   - You should see your landing page!

4. **Test it:**
   - Click the "Start Quiz" button
   - Try answering the quiz questions
   - See the social proof section
   - Notice the countdown timer
   - Check the bottom-right for live notifications

### Step 4: Make Changes and See Them Update

1. **Open the config file:**
   - In a text editor (Notepad++, VS Code, or even Notepad)
   - Open: `config\copy.json`

2. **Make a simple change:**
   - Find the line with `"title": "Discover Your Perfect Match"`
   - Change it to: `"title": "My Awesome Landing Page"`
   - Save the file

3. **See the change:**
   - Go back to your browser at `http://localhost:3000`
   - **Refresh the page** (F5 or Ctrl+R)
   - You should see your new title!

4. **Stop the server:**
   - Go back to PowerShell
   - Press `Ctrl + C`
   - Type `Y` and press Enter if asked

---

## Part 3: Customizing Your Landing Page

### Step 1: Edit the Hero Section

1. **Open `config\copy.json`** in a text editor

2. **Find the "hero" section** (near the top):
   ```json
   "hero": {
     "title": "Discover Your Perfect Match",
     "subtitle": "Take our quick quiz to find out what's right for you",
     "cta": "Start Quiz"
   }
   ```

3. **Change the text:**
   - Replace with your own headlines
   - Keep the quotes and commas exactly as they are
   - Save the file

4. **See your changes:**
   - If server is running, refresh browser
   - If not, run `npm run dev` again

### Step 2: Edit Testimonials

1. **Still in `config\copy.json`**, find `"testimonials"`:

2. **Edit each testimonial:**
   ```json
   {
     "name": "Sarah M.",
     "location": "New York",
     "text": "This changed everything for me!",
     "time": "2 hours ago"
   }
   ```
   - Change names, locations, text, and times
   - You can add more testimonials by copying a block and adding commas

### Step 3: Edit Quiz Questions

1. **Find `"quiz"` section** in `config\copy.json`

2. **Edit questions:**
   ```json
   {
     "id": 1,
     "question": "What are you looking for?",
     "options": ["Option A", "Option B", "Option C"]
   }
   ```
   - Change questions and options to match your offer

### Step 4: Change Colors

1. **Open `config\theme.json`**

2. **Find the colors section:**
   ```json
   "colors": {
     "primary": "#0ea5e9",    // Main blue color
     "secondary": "#0284c7",  // Darker blue
     "accent": "#0369a1"      // Even darker blue
   }
   ```

3. **Change colors:**
   - Use hex codes (like `#ff0000` for red, `#00ff00` for green)
   - Find color codes at: https://htmlcolorcodes.com/
   - Save and refresh browser

---

## Part 4: Deploying to Vultr

### Step 1: Prepare Your Code

1. **Make sure everything works locally:**
   - Test your landing page
   - Make all your customizations
   - Stop the dev server (`Ctrl + C`)

2. **Build for production:**
   ```powershell
   npm run build
   ```
   - This creates optimized files (like compiling Python to bytecode)
   - Wait for it to finish (1-2 minutes)

### Step 2: Connect to Your Vultr Server

**You know this part - it's like SSH'ing to run your Python scripts!**

1. **Open PowerShell** (or use PuTTY if you prefer)

2. **SSH into your Vultr server:**
   ```powershell
   ssh root@your-server-ip
   ```
   - Replace `your-server-ip` with your actual Vultr IP address
   - Enter your password when prompted

### Step 3: Set Up Docker on Vultr

**Docker is like a container system - it packages everything together**

1. **Update system:**
   ```bash
   apt update && apt upgrade -y
   ```

2. **Install Docker:**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   rm get-docker.sh
   ```

3. **Verify Docker:**
   ```bash
   docker --version
   ```
   - Should show a version number

4. **Install Docker Compose:**
   ```bash
   curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   chmod +x /usr/local/bin/docker-compose
   ```

5. **Verify Docker Compose:**
   ```bash
   docker-compose --version
   ```

### Step 4: Upload Your Project to Vultr

**Option A: Using Git (Recommended if you have a Git repository)**

1. **On Vultr server, clone your repo:**
   ```bash
   cd /root
   git clone <your-repo-url>
   cd estrelar-landing-pages
   ```

**Option B: Using SCP (From your Windows machine)**

1. **Open a NEW PowerShell window** (keep the SSH one open)

2. **Navigate to your project folder:**
   ```powershell
   cd C:\Users\mmsou\Documents\Estrelar
   ```

3. **Upload files to Vultr:**
   ```powershell
   scp -r * root@your-server-ip:/root/estrelar-landing-pages
   ```
   - Replace `your-server-ip` with your actual IP
   - Enter password when prompted
   - This copies all files to your server

4. **On Vultr server, create directory:**
   ```bash
   mkdir -p /root/estrelar-landing-pages
   ```

### Step 5: Deploy with Docker

1. **On your Vultr server, navigate to project:**
   ```bash
   cd /root/estrelar-landing-pages
   ```

2. **Build and start:**
   ```bash
   docker-compose up -d --build
   ```
   - `-d` means "detached" (runs in background)
   - `--build` builds the Docker image
   - This takes 5-10 minutes the first time

3. **Check if it's running:**
   ```bash
   docker-compose ps
   ```
   - Should show "Up" status

4. **View logs (to see if there are errors):**
   ```bash
   docker-compose logs -f
   ```
   - Press `Ctrl + C` to exit logs

5. **Test it:**
   - Open browser
   - Go to: `http://your-server-ip:3000`
   - You should see your landing page!

### Step 6: Set Up Domain Name (Optional but Recommended)

**This is like pointing a domain to your Python app**

1. **Install Nginx:**
   ```bash
   apt install nginx -y
   ```

2. **Create Nginx config:**
   ```bash
   nano /etc/nginx/sites-available/landing-page
   ```

3. **Paste this (replace `your-domain.com`):**
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
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **Save and exit:**
   - Press `Ctrl + X`
   - Press `Y` to save
   - Press `Enter` to confirm

5. **Enable site:**
   ```bash
   ln -s /etc/nginx/sites-available/landing-page /etc/nginx/sites-enabled/
   rm /etc/nginx/sites-enabled/default
   nginx -t
   systemctl restart nginx
   ```

6. **Point your domain:**
   - In your domain registrar (where you bought the domain)
   - Add an A record pointing to your Vultr IP
   - Wait 5-10 minutes for DNS to propagate

7. **Add SSL (free HTTPS):**
   ```bash
   apt install certbot python3-certbot-nginx -y
   certbot --nginx -d your-domain.com -d www.your-domain.com
   ```
   - Follow the prompts
   - Your site will now have HTTPS!

---

## Part 5: Managing Your Deployment

### View Logs (Like checking Python script output)

```bash
docker-compose logs -f landing-page
```

### Restart After Making Changes

1. **Upload new files** (if you changed config files)
2. **Rebuild and restart:**
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

### Stop the Site

```bash
docker-compose down
```

### Start the Site

```bash
docker-compose up -d
```

### Check Status

```bash
docker-compose ps
```

---

## Troubleshooting

### "Port 3000 already in use"

```bash
# Find what's using the port
netstat -tulpn | grep 3000

# Or change the port in docker-compose.yml
# Change "3000:3000" to "3001:3000"
```

### "Cannot connect to Docker daemon"

```bash
# Start Docker service
systemctl start docker
systemctl enable docker
```

### Site shows "502 Bad Gateway"

```bash
# Check if container is running
docker-compose ps

# Check logs
docker-compose logs

# Restart
docker-compose restart
```

### Changes not showing up

1. Make sure you saved the config files
2. Rebuild: `docker-compose up -d --build`
3. Clear browser cache (Ctrl + Shift + Delete)

---

## Quick Reference Commands

### Local Development
```powershell
npm install          # Install dependencies (first time)
npm run dev          # Start dev server
npm run build        # Build for production
```

### Vultr Server
```bash
docker-compose up -d --build    # Deploy/update
docker-compose down             # Stop
docker-compose restart         # Restart
docker-compose logs -f         # View logs
docker-compose ps              # Check status
```

---

## Next Steps After Deployment

1. ✅ Test your landing page on the live URL
2. ✅ Set up analytics (Google Analytics, etc.)
3. ✅ Create variations by copying config files
4. ✅ Set up monitoring (UptimeRobot for free)
5. ✅ Add payment integration if needed

---

## Need Help?

- Check `README.md` for more details
- Review `DEPLOYMENT.md` for advanced setup
- Look at component files to understand structure
- Use Cursor AI to help modify code if needed

