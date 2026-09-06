to mack that # Development Guide

This guide will help you set up and run the chanhdai.com project locally.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js**: Version 20 or >= 22 ([Download Node.js](https://nodejs.org/))
- **pnpm**: Version >= 9 (Package manager)

### Installing pnpm

If you don't have pnpm installed, you can install it using npm:

```bash
npm install -g pnpm
```

Or using the standalone script:

```bash
# On Windows (PowerShell)
iwr https://get.pnpm.io/install.ps1 -useb | iex

# On macOS/Linux
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

## Getting Started

### 1. Download the Project

If you have this project as a zip file, extract it to your desired location.

If you're cloning from GitHub:

```bash
git clone https://github.com/ncdai/chanhdai.com.git
cd chanhdai.com
```

### 2. Install Dependencies

Navigate to the project directory and install all required dependencies:

```bash
cd "c:\Users\ggowt\OneDrive\Desktop\New folder\final project\chanhdai.com\chanhdai.com-main"
pnpm install
```

This will install all the packages listed in `package.json`.

### 3. Run the Development Server

Start the development server with:

```bash
pnpm dev
```

The application will start on **http://localhost:1408** (custom port configured in package.json)

You should see output similar to:

```
▲ Next.js 15.4.6
- Local:        http://localhost:1408
✓ Ready in 2.5s
```

### 4. Open in Browser

Open your browser and navigate to:

```
http://localhost:1408
```

You should now see the portfolio website running locally!

## Available Scripts

The following npm scripts are available in this project:

### Development

- **`pnpm dev`** - Start development server on port 1408 with Turbopack
- **`pnpm build`** - Build the application for production
- **`pnpm start`** - Start the production server
- **`pnpm preview`** - Build and start production server on port 1408

### Code Quality

- **`pnpm lint`** - Run ESLint to check for code issues
- **`pnpm lint:fix`** - Automatically fix ESLint issues
- **`pnpm check-types`** - Type-check TypeScript files
- **`pnpm format:check`** - Check code formatting with Prettier
- **`pnpm format:write`** - Auto-format code with Prettier

### Component Registry

- **`pnpm registry:build`** - Build the component registry
- **`pnpm capture`** - Capture component screenshots

### Other

- **`pnpm generate-libphonenumber-metadata`** - Generate phone number metadata
- **`pnpm upgrade:next`** - Upgrade Next.js to the latest version
- **`pnpm upgrade:tailwind`** - Upgrade Tailwind CSS

## Project Structure

```
chanhdai.com-main/
├── .next/                 # Next.js build output
├── .vscode/              # VS Code configuration
├── node_modules/         # Dependencies
├── public/               # Static assets
├── src/                  # Source code
│   ├── app/             # Next.js app directory
│   ├── components/      # React components
│   ├── scripts/         # Build scripts
│   └── __registry__/    # Component registry
├── next.config.mjs      # Next.js configuration
├── package.json         # Project dependencies and scripts
├── tailwind.config.js   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## Tech Stack

This project uses:

- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - UI components
- **MDX** - Blog content
- **Radix UI** - Accessible components
- **Motion** - Animations

## Building for Production

To create a production build:

```bash
pnpm build
```

Then start the production server:

```bash
pnpm start
```

## Troubleshooting

### Port Already in Use

If port 1408 is already in use, you can:

1. Stop the process using that port
2. Or modify the port in `package.json`:
   ```json
   "dev": "next dev -p 3000 --turbopack"
   ```

### Node Version Issues

Ensure you're using Node.js version 20 or >= 22. Check your version:

```bash
node --version
```

If you need to switch Node versions, consider using [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager).

### Dependencies Installation Fails

Try clearing the cache and reinstalling:

```bash
pnpm store prune
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### Build Errors

Make sure all dependencies are installed and TypeScript has no errors:

```bash
pnpm install
pnpm check-types
```

## Customization

### Removing Personal Information

If you're using this as a template, make sure to:

1. Update `package.json` with your information (author, repository, etc.)
2. Replace personal content in the `src/` directory
3. Update images in the `public/` directory
4. Modify blog posts and component examples

### Environment Variables

Create a `.env.local` file if you need environment-specific configuration:

```bash
# Example
NEXT_PUBLIC_SITE_URL=http://localhost:1408
```

## Contributing

This is a personal portfolio project. See the [LICENSE](./LICENSE) file for usage terms.

## Support

For issues specific to this template, check the [original repository](https://github.com/ncdai/chanhdai.com).

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
