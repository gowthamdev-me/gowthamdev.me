# Installing Prerequisites for chanhdai.com Project

## Prerequisites Required

Your system needs:
1. **Node.js** (version 20 or >= 22)
2. **pnpm** (version >= 9)

Currently, neither is installed on your system.

## Installation Instructions

### Step 1: Install Node.js

**Option A: Using Official Installer (Recommended)**

1. Visit [https://nodejs.org/](https://nodejs.org/)
2. Download the **LTS version** (Long Term Support) - currently v20.x or v22.x
3. Run the installer
4. Follow the installation wizard (accept defaults)
5. Restart your terminal/PowerShell

**Option B: Using Windows Package Manager (winget)**

If you have winget available, run this in PowerShell as Administrator:

```powershell
winget install OpenJS.NodeJS.LTS
```

### Step 2: Verify Node.js Installation

After installation, open a **new** PowerShell window and verify:

```powershell
node --version
```

You should see something like `v20.x.x` or `v22.x.x`

### Step 3: Install pnpm

Once Node.js is installed, install pnpm using npm:

```powershell
npm install -g pnpm
```

### Step 4: Verify pnpm Installation

Check pnpm is installed:

```powershell
pnpm --version
```

You should see version 9.x or higher.

---

## After Prerequisites Are Installed

Once both Node.js and pnpm are installed, you can run the project with:

```powershell
# Navigate to project directory
cd "c:\Users\ggowt\OneDrive\Desktop\New folder\final project\chanhdai.com\chanhdai.com-main"

# Install dependencies
pnpm install

# Run the development server
pnpm dev
```

Then visit **http://localhost:1408** in your browser.

---

## Need Help?

If you encounter any issues during installation:
- Make sure to restart your terminal/PowerShell after installing Node.js
- Run PowerShell as Administrator if you get permission errors
- Check the [DEVELOPMENT.md](file:///c:/Users/ggowt/OneDrive/Desktop/New%20folder/final%20project/chanhdai.com/chanhdai.com-main/DEVELOPMENT.md) for troubleshooting tips
