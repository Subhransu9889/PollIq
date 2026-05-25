# PollIq

A modern, full-stack survey and form management platform built with a monorepo architecture using Turborepo, Next.js, Express, and tRPC.

## 📋 Project Overview

PollIq is a comprehensive platform for creating, managing, and analyzing surveys and forms with real-time capabilities. It features a responsive web interface, scalable backend API, and robust database layer.

## 🏗️ Architecture

This is a [Turborepo](https://turborepo.com/)-based monorepo with the following structure:

### Apps

- **`web`**: Next.js 13+ frontend application with modern UI components and real-time capabilities
- **`api`**: Express.js backend server with tRPC for type-safe APIs

### Packages

- **`@repo/database`**: Drizzle ORM layer with database schema and migrations
- **`@repo/trpc`**: Shared tRPC router, context, and client setup
- **`@repo/services`**: Business logic services (user, form management, etc.)
- **`@repo/logger`**: Centralized logging utilities
- **`@repo/eslint-config`**: ESLint configurations
- **`@repo/typescript-config`**: TypeScript configurations

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm (or npm/yarn)
- Docker and Docker Compose (for local development)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Polliq
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
   - Copy `.env.example` files to `.env` in respective apps/packages
   - Configure database, API, and client URLs as needed

4. Start the development environment:
```bash
# Start all services (web, api, and dependencies)
pnpm dev
```

5. Open your browser:
   - Web app: `http://localhost:3000`
   - API docs: `http://localhost:5000/docs`

## 📦 Available Commands

### Development
```bash
pnpm dev          # Start all apps in development mode
pnpm build        # Build all apps and packages
pnpm lint         # Run ESLint across the monorepo
pnpm format       # Format code with Prettier
```

### Database
```bash
pnpm db:migrate   # Run database migrations
pnpm db:studio    # Open Drizzle Studio
```

### Individual Workspace Commands
```bash
pnpm -F web dev       # Start only web app
pnpm -F api dev       # Start only API server
pnpm -F @repo/database build  # Build database package
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 13+
- **Styling**: CSS with component library
- **API Client**: tRPC
- **UI Components**: Custom shadcn/ui-based components

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **API**: tRPC
- **Authentication**: Configured via environment

### Database
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL (configured in env)

### DevTools
- **Monorepo**: Turborepo
- **Package Manager**: pnpm
- **Language**: TypeScript
- **Linting**: ESLint
- **Formatting**: Prettier
- **Containerization**: Docker & Docker Compose

## 📁 Project Structure

```
.
├── apps/
│   ├── api/           # Express.js API server
│   └── web/           # Next.js frontend app
├── packages/
│   ├── database/      # Drizzle ORM & schema
│   ├── trpc/          # tRPC setup
│   ├── services/      # Business logic
│   ├── logger/        # Logging utilities
│   ├── eslint-config/ # Linting rules
│   └── typescript-config/ # TS configuration
├── pnpm-workspace.yaml
├── turbo.json
└── docker-compose.yml
```

## 🔄 Development Workflow

1. **Create a feature branch** from `main`
2. **Make changes** across relevant apps/packages
3. **Run tests and lint** before committing
4. **Create a pull request** for review
5. **Deploy** after approval

## 🐳 Docker

The project includes a `docker-compose.yml` for local services. Start services with:
```bash
docker-compose up -d
```

## 📚 Additional Resources

- [Turborepo Documentation](https://turborepo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [tRPC Documentation](https://trpc.io/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Express.js Documentation](https://expressjs.com/)

## 📝 License

[Add your license information here]

## 👥 Contributing

[Add contribution guidelines here]

You can build a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo build --filter=docs

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo build --filter=docs
yarn exec turbo build --filter=docs
pnpm exec turbo build --filter=docs
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev
yarn exec turbo dev
pnpm exec turbo dev
```

You can develop a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev --filter=web

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev --filter=web
yarn exec turbo dev --filter=web
pnpm exec turbo dev --filter=web
```

