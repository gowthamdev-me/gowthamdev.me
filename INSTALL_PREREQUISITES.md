# Installing Prerequisites for gowthamdev.me

This document outlines the necessary tools and environment setup for running the project locally.

## 1. Node.js

- **Required Version**: `20.x` or `>=22.x`
- **Download**: [https://nodejs.org/](https://nodejs.org/)

Verify your installation:
```bash
node -v
npm -v
```

## 2. Package Manager (pnpm)

pnpm is recommended for fast and disk-space efficient installations:

```bash
npm install -g pnpm
```

Verify:
```bash
pnpm -v
```

## 3. Git

- **Download**: [https://git-scm.com/](https://git-scm.com/)

Verify:
```bash
git --version
```

## 4. Run the Project

```bash
git clone https://github.com/gowthamdev-me/gowthamdev.me.git
cd gowthamdev.me
pnpm install
pnpm dev
```
