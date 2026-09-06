# Development Guide

This guide will help you set up and run the **gowthamdev.me** project locally.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js**: Version 20 or >= 22 ([Download Node.js](https://nodejs.org/))
- **pnpm**: Version >= 9 (Package manager) or npm / bun

### Installing pnpm

If you don't have pnpm installed:

```bash
npm install -g pnpm
```

## Getting Started

### 1. Clone the Project

```bash
git clone https://github.com/gowthamdev-me/gowthamdev.me.git
cd gowthamdev.me
```

### 2. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 3. Run the Development Server

Start the development server with:

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:1408](http://localhost:1408) (or [http://localhost:3000](http://localhost:3000)) in your browser.

## Admin Dashboard

Access the dynamic content management dashboard at:
```
http://localhost:1408/admin/dashboard
```
Features available in the admin panel:
- **Profile & Bio**: Edit name, title, bio, and section visibilities.
- **Cover Settings**: Customize profile cover animations and patterns.
- **Projects**: Add, edit, or reorder projects.
- **Tech Stack**: Update technical skills and tools.
- **Social Links**: Manage public social profiles.
- **Blog Posts**: Create and manage blog articles.

## Build for Production

To build the project for production:

```bash
pnpm build
```

To preview the production build locally:

```bash
pnpm preview
```

## License

This project is licensed under the [MIT License](./LICENSE).
