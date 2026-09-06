# Quick Setup Guide

Get the gowthamdev.me portfolio project running in 3 simple steps!

## 🚀 Quick Start

### Step 1: Install Prerequisites

**Install Node.js** (version 20 or >= 22)
- Download from [nodejs.org](https://nodejs.org/)
- Verify installation: `node --version`

**Install pnpm** (package manager)
```bash
npm install -g pnpm
```

### Step 2: Install Dependencies

Open your terminal in the project directory and run:

```bash
pnpm install
```

⏱️ This may take a few minutes the first time.

### Step 3: Run the Project

Start the development server:

```bash
pnpm dev
```

🎉 **That's it!** Open your browser and visit:

```
http://localhost:1408
```

## 📋 Common Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Run production build |
| `pnpm lint` | Check code quality |

## ❓ Problems?

### Port 1408 is busy?
Change the port in `package.json`:
```json
"dev": "next dev -p 3000 --turbopack"
```

### Installation fails?
Make sure you're using Node.js version 20 or higher:
```bash
node --version
```

### Need more help?
Check the [DEVELOPMENT.md](./DEVELOPMENT.md) file for detailed instructions and troubleshooting.

## 📚 What's Next?

- Explore the code in the `src/` directory
- Customize the portfolio content
- Read the full [Development Guide](./DEVELOPMENT.md)
- Check out the [README.md](./README.md) for project features

---

**Built with:** Next.js 15 • React 19 • Tailwind CSS v4 • TypeScript
