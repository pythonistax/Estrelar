# Windows-Specific Setup Guide

## Quick Start for Windows Users

### Step 1: Install Node.js (5 minutes)

1. **Download:**
   - Visit: https://nodejs.org/
   - Click the big green "LTS" button
   - The file will download (about 30MB)

2. **Install:**
   - Double-click the downloaded `.msi` file
   - Click "Next" → "Next" → "Install"
   - Wait 1-2 minutes
   - Click "Finish"

3. **Verify:**
   - Press `Windows Key + X`
   - Click "Windows PowerShell" or "Terminal"
   - Type: `node --version`
   - Should show: `v20.x.x` or similar
   - Type: `npm --version`
   - Should show: `10.x.x` or similar

✅ **Done!** Node.js is installed.

---

### Step 2: Open Your Project (1 minute)

1. **Open PowerShell:**
   - Press `Windows Key`
   - Type: `PowerShell`
   - Press Enter

2. **Navigate to your project:**
   ```powershell
   cd C:\Users\mmsou\Documents\Estrelar
   ```

3. **Verify you're in the right place:**
   ```powershell
   dir
   ```
   - You should see: `package.json`, `README.md`, `app`, `components`, etc.

---

### Step 3: Install Dependencies (2-5 minutes)

**This downloads all the code libraries needed (like Python packages)**

```powershell
npm install
```

**What you'll see:**
- Lots of text scrolling
- Lines like "added 500 packages"
- This is normal!

**Wait until:**
- You see your prompt again (`PS C:\Users\...>`)
- No red error messages

**If you see errors:**
- Make sure you're in the right folder
- Try: `npm cache clean --force`
- Then: `npm install` again

---

### Step 4: Start the Website (30 seconds)

```powershell
npm run dev
```

**What happens:**
- Text appears saying:
  ```
  ▲ Next.js 14.0.4
  - Local:        http://localhost:3000
  - Ready in 2.5s
  ```

**IMPORTANT:** 
- **Keep this window open!** The server is running.
- Don't close PowerShell while testing

---

### Step 5: View Your Landing Page (10 seconds)

1. **Open your web browser** (Chrome, Edge, Firefox, etc.)

2. **Go to:**
   ```
   http://localhost:3000
   ```

3. **You should see:**
   - A blue/purple gradient header
   - "Start Quiz" button
   - Countdown timer
   - Social proof section
   - Live notifications (bottom-right)

4. **Test it:**
   - Click "Start Quiz"
   - Answer questions
   - See how it works!

---

### Step 6: Make a Change (2 minutes)

1. **Open Notepad** (or any text editor)

2. **Open this file:**
   ```
   C:\Users\mmsou\Documents\Estrelar\config\copy.json
   ```

3. **Find this line** (around line 3):
   ```json
   "title": "Discover Your Perfect Match",
   ```

4. **Change it to:**
   ```json
   "title": "My First Landing Page!",
   ```

5. **Save the file** (Ctrl + S)

6. **Go back to browser:**
   - Refresh the page (F5 or Ctrl + R)
   - You should see your new title!

**🎉 Congratulations!** You just customized your landing page!

---

### Step 7: Stop the Server

**When you're done testing:**

1. **Go back to PowerShell**
2. **Press:** `Ctrl + C`
3. **Type:** `Y` (if asked)
4. **Press:** Enter

The server stops. You can start it again anytime with `npm run dev`.

---

## Common Windows Issues

### Issue: "npm is not recognized"

**Solution:**
1. Restart your computer
2. Open PowerShell again
3. Try `npm --version` again

If still not working:
- Reinstall Node.js
- Make sure "Add to PATH" was checked during installation

### Issue: "Port 3000 already in use"

**Solution:**
1. Find what's using port 3000:
   ```powershell
   netstat -ano | findstr :3000
   ```
2. Kill the process (replace `PID` with the number shown):
   ```powershell
   taskkill /PID <PID> /F
   ```
3. Or use a different port (we can show you how)

### Issue: "Cannot find module"

**Solution:**
```powershell
# Delete node_modules folder
Remove-Item -Recurse -Force node_modules

# Delete package-lock.json
Remove-Item package-lock.json

# Reinstall
npm install
```

### Issue: PowerShell won't let you run scripts

**Solution:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## What Each Command Does

| Command | What It Does | Python Equivalent |
|---------|--------------|-------------------|
| `npm install` | Downloads dependencies | `pip install -r requirements.txt` |
| `npm run dev` | Starts dev server | `python app.py` |
| `npm run build` | Creates production files | `python setup.py build` |
| `npm start` | Runs production server | `gunicorn app:app` |

---

## File Structure Explained

```
Estrelar/
├── app/                    # Main website pages (like your main.py)
│   ├── page.tsx           # Homepage
│   └── layout.tsx         # Website wrapper
├── components/            # Reusable pieces (like Python modules)
│   ├── SocialProof.tsx   # Testimonials section
│   ├── QuizFlow.tsx      # Quiz logic
│   └── ...
├── config/               # Settings (like config.py)
│   ├── copy.json        # All text content
│   ├── theme.json       # Colors/styling
│   └── app.json         # Feature flags
├── package.json          # Dependencies list (like requirements.txt)
└── README.md            # Documentation
```

---

## Next Steps

1. ✅ **Customize content** - Edit `config/copy.json`
2. ✅ **Change colors** - Edit `config/theme.json`
3. ✅ **Test locally** - Make sure everything works
4. ✅ **Deploy to Vultr** - Follow Part 4 of STEP_BY_STEP_GUIDE.md

---

## Tips for Windows Users

- **Use VS Code** (free editor): https://code.visualstudio.com/
  - Better than Notepad for editing JSON files
  - Shows errors and formatting

- **Use Git Bash** instead of PowerShell if you prefer:
  - Comes with Git installation
  - More Linux-like commands

- **Keep PowerShell window open** while `npm run dev` is running

- **Use Ctrl + C** to stop any running command

---

## Quick Test Checklist

- [ ] Node.js installed (`node --version` works)
- [ ] npm installed (`npm --version` works)
- [ ] In project folder (`dir` shows package.json)
- [ ] Dependencies installed (`npm install` completed)
- [ ] Server starts (`npm run dev` shows localhost:3000)
- [ ] Website loads in browser
- [ ] Can make changes and see them update

If all checked ✅, you're ready to customize and deploy!

