# 🚀 AutoDoc.ai — Setup Guide

## What You Need First

| Tool | Version | Check | Install |
|------|---------|-------|---------|
| Node.js | 18+ | `node -v` | https://nodejs.org |
| npm | 9+ | `npm -v` | Comes with Node.js |
| Git | any | `git --version` | https://git-scm.com |

---

## Step 1 — Install Dependencies

Open your terminal, navigate to the project folder, and run:

```bash
cd autodoc-ai
npm install
```

This installs everything for all 3 packages (CLI, frontend, server) in one shot.

---

## Step 2 — Set Up Your FREE AI Key (Groq)

Groq gives you **6,000 free AI requests per day** — no credit card needed.

**a)** Go to https://console.groq.com → Sign up → "API Keys" → "Create API Key"

**b)** Copy your key (looks like `gsk_xxxxxxxxxxxx`)

**c)** In the project folder, copy the env template:

```bash
# Windows (Command Prompt)
copy .env.example .env

# Windows (PowerShell) or Mac/Linux
cp .env.example .env
```

**d)** Open `.env` in any text editor and replace the placeholder:

```
GROQ_API_KEY=gsk_your_actual_key_here
```

> **No Groq account?** That's fine — AutoDoc still works without AI.
> It will generate the file tree, installation steps, and license section
> using code analysis only. Just skip this step.

---

## Step 3 — Start the App

```bash
npm run dev
```

You'll see two things start:
```
[SERVER] 🚀 AutoDoc.ai server running on http://localhost:4000
[FRONTEND] ➜  Local: http://localhost:3000
```

Open **http://localhost:3000** in your browser.

---

## Step 4 — Generate Your First README

1. In the text box at the top, type the **full path** to any project folder:
   - Windows: `C:\Users\YourName\Projects\my-app`
   - Mac/Linux: `/Users/yourname/projects/my-app`
   - Or just `.` to scan the autodoc-ai folder itself

2. Click **⚡ Generate**

3. Watch the progress bar → file tree appears on the left, README preview on the right

---

## Step 5 — Enable Watch Mode (optional)

To auto-regenerate README every time you save a file in your project, open a **separate terminal**:

```bash
# Windows
npx autodoc watch C:\Users\YourName\Projects\my-app

# Mac/Linux
npx autodoc watch /Users/yourname/projects/my-app
```

The dashboard's **Watch Mode** panel (right side) will show live events as files change.

---

## Troubleshooting

### ❌ `npm install` fails
```bash
# Clear cache and retry
npm cache clean --force
npm install
```

### ❌ Port 3000 or 4000 already in use
Edit `packages/frontend/vite.config.ts` → change `port: 3000`
Edit `server/src/index.ts` → change `SERVER_PORT` default

### ❌ "Cannot find module" errors
```bash
# Make sure you're in the autodoc-ai root folder
cd autodoc-ai
npm install
npm run dev
```

### ❌ Scan returns empty / wrong directory
Use the **absolute full path** to your project.
- ✅ `C:\Users\CHAROM\Projects\my-app`
- ❌ `./my-app` (relative paths can be tricky on Windows)

### ❌ AI features not working (no Groq key)
The app works without AI — you'll get:
- ✅ File tree
- ✅ Installation section (auto-detected)
- ✅ License section
- ❌ AI feature descriptions (needs Groq key)

---

## File Output

After generation, `README.md` is written to the **root of the scanned project** — not inside autodoc-ai. Check your project folder.

---

## Quick Reference

```bash
npm run dev              # Start everything (frontend + server)
npm run dev:frontend     # Frontend only (port 3000)
npm run dev:server       # Server only (port 4000)
npx autodoc generate .   # CLI: one-shot generate
npx autodoc watch .      # CLI: watch mode
npx autodoc --help       # CLI: all commands
```