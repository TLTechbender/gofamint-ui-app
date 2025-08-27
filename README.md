# 🌟 GoFamint UI

> A modern, full-stack web application built with Next.js and Sanity CMS, powered by Turborepo for optimal development experience for Gofamint Students Fellowship, University of Ibadan



## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Building](#building)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Scripts Reference](#scripts-reference)
- [Docker Support](#docker-support)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

GoFamint UI is a modern, full-stack web application designed with scalability, performance and developer experience in mind. Built using a monorepo architecture with Turborepo, it features a Next.js frontend application with server actions and a Sanity CMS for content management.

### ✨ Key Features

- 🚀 **Modern Stack**: Next.js 15+ with App Router and Server Actions
- 🎨 **Beautiful UI**: Tailwind CSS  for responsive design and fast development
- 🔐 **Authentication**: NextAuth.js with custom middleware and Google OAuth
- 📝 **Content Management**: Sanity Studio with custom schema types
- 🏗️ **Monorepo**: Turborepo for efficient development workflow
- 🐳 **Docker Ready**: Containerization support (coming soon)
- 🔒 **Type Safety**: Full TypeScript implementation across all packages
- 📧 **Email Integration**: SMTP configuration for notifications
- 🗃️ **Database**: Prisma ORM with custom middleware
- ⚡ **Server Actions**: Modern data fetching without traditional API routes
- 🎯 **Custom Hooks**: Reusable React hooks for common functionality

## 🏗️ Architecture

```
gofamint-ui/
├── packages/
│   ├── gofamintui-app/         # Next.js Frontend Application
│   │   ├── .next/             # Next.js build output
│   │   ├── actions/           # Server Actions (replaces API routes)
│   │   ├── app/               # App Router directory
│   │   ├── components/        # Reusable React components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utility functions & configurations
│   │   ├── prisma/            # Database schema & migrations
│   │   ├── public/            # Static assets
│   │   └── sanity/            # Sanity client & schemas
│   └── gofamintui-cms/         # Sanity Studio CMS
│       ├── .sanity/           # Sanity build artifacts
│       ├── schemaTypes/       # Content type definitions
│       ├── static/            # Static CMS assets
│       └── sanity.config.ts   # Sanity Studio configuration
├── package.json               # Root workspace configuration
├── turbo.json                 # Turborepo build configuration
└── README.md                  # Project documentation
```

## 🛠️ Tech Stack

### Frontend (`gofamintui-app`)
- **Framework**: [Next.js 15+](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 
- **Database**: [Prisma ORM](https://prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) with custom auth configuration
- **Content**: Sanity CMS integration with custom schemas
- **API Layer**: React Server Actions (traditional API routes) + a Few Api routes
- **State Management**: React Server Components + Server Actions
- **Middleware**: Custom authentication and routing middleware

### CMS (`gofamintui-cms`)
- **Platform**: [Sanity Studio](https://sanity.io/)
- **Language**: TypeScript
- **Schema Types**: Custom content type definitions
- **Template**: Clean, production-ready setup
- **Environment**: Production dataset with webhook integration

### Development & Tooling
- **Monorepo**: [Turborepo](https://turbo.build/)
- **Package Manager**: npm with workspaces
- **Linting**: ESLint with TypeScript support
- **Formatting**: Prettier
- **Containerization**: Docker (planned)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0
- **npm** >= 10.0.0
- **Git** for version control
- **Docker** (optional, for containerized development)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/TLTechbender/gofamint-ui-app.git
cd gofamint-ui-app
```

### 2. Install Dependencies

```bash
# Install all dependencies for the entire monorepo
npm run install:all

# Alternative: Clean install (removes existing node_modules first)
npm run install:clean
```

### 3. Environment Setup

Create environment files for both packages:

```bash
# Copy example environment files
cp packages/gofamintui-app/.env.example packages/gofamintui-app/.env.local
cp packages/gofamintui-cms/.env.example packages/gofamintui-cms/.env.local
```

Configure your environment variables (see [Environment Variables](#environment-variables) section).

## 💻 Development

### Start All Services

```bash
# Start both app and CMS in development mode
npm run dev
```

This will start:
- **Next.js App**: http://localhost:3000
- **Sanity Studio**: http://localhost:3333

### Start Individual Services

```bash
# Start only the Next.js application
npm run dev:app

# Start only the Sanity CMS
npm run dev:cms
```



## 🏗️ Building

### Build All Packages

```bash
# Build the entire monorepo
npm run build
```

### Build Individual Packages

```bash
# Build only the Next.js app
npm run build:app

# Build only the Sanity CMS
npm run build:cms
```

## 🚀 Deployment

The application is designed to be platform-agnostic but optimized for Vercel deployment.

### Manual Deployment

```bash
# Build the application
npm run build:app

# The built application will be in packages/gofamintui-app/.next
```

## 🔐 Environment Variables

### Next.js App (`packages/gofamintui-app/.env.local`)

```bash
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_SANITY_TOKEN=your_sanity_token
NEXT_PUBLIC_SANITY_TOKEN=your_public_sanity_token

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_VERIFICATION_CODE=your_verification_code
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
AUTH_GOOGLE_CLIENT_ID=your_google_client_id
AUTH_GOOGLE_CLIENT_SECRET=your_google_client_secret

# Security & Webhooks
NEXT_OTP_SECRET=your_otp_secret
SANITY_AUTHOR_WEBHOOK_SECRET=your_webhook_secret
SANITY_WEBHOOK_SECRET=your_webhook_secret

# Email Configuration
NEXT_SMTP_EMAIL_SERVICE=your_email_service
NEXT_SMTP_EMAIL_ADDRESS=your_email_address
NEXT_SMTP_EMAIL_APP_PASSWORD=your_email_password
```

### Sanity CMS (`packages/gofamintui-cms/.env.local`)

```bash
# Sanity Studio Configuration
SANITY_STUDIO_PROJECT_ID=your_sanity_project_id
SANITY_STUDIO_DATASET=production
```

## 📜 Scripts Reference

### Root Level Commands

| Command | Description |
|---------|-------------|
| `npm run install:all` | Install dependencies for all packages |
| `npm run install:packages` | Install workspace dependencies |
| `npm run install:clean` | Clean install (removes node_modules first) |
| `npm run clean:all` | Remove all node_modules and build artifacts |
| `npm run dev` | Start all services in development |
| `npm run build` | Build all packages |
| `npm run lint` | Lint all packages |
| `npm run test` | Run tests across all packages |
| `npm run type-check` | TypeScript type checking |

### Package-Specific Commands

| Command | Description |
|---------|-------------|
| `npm run dev:app` | Start Next.js app only |
| `npm run dev:cms` | Start Sanity Studio only |
| `npm run build:app` | Build Next.js app only |
| `npm run build:cms` | Build Sanity Studio only |

### Docker Commands (Planned)

| Command | Description |
|---------|-------------|
| `npm run docker:dev` | Start development containers |
| `npm run docker:prod` | Start production containers |
| `npm run docker:build` | Build Docker images |

## 🐳 Docker Support

> **Note**: Docker configuration is planned for future implementation.

When implemented, Docker support will include:

- **Development Environment**: Multi-service setup with hot reloading
- **Production Environment**: Optimized containers for deployment
- **Database Services**: PostgreSQL/MySQL container integration
- **Nginx Proxy**: Load balancing and SSL termination

### Planned Docker Structure

```
docker/
├── app.Dockerfile          # Next.js app container
├── cms.Dockerfile          # Sanity Studio container
├── docker-compose.yml      # Development setup
└── docker-compose.prod.yml # Production setup
```

## 📁 Project Structure

```
gofamint-ui/
├── packages/
│   ├── gofamintui-app/
│   │   ├── .next/                # Next.js build output
│   │   ├── actions/              # Server Actions (modern API layer)
│   │   ├── app/                  # Next.js App Router pages & layouts
│   │   ├── components/           # Reusable React UI components
│   │   ├── hooks/                # Custom React hooks
│   │   ├── lib/                  # Utility functions & configurations
│   │   ├── prisma/               # Database schema & migrations
│   │   ├── public/               # Static assets (images, icons, etc.)
│   │   ├── sanity/               # Sanity client configuration & schemas
│   │   │   ├── .env              # Sanity environment variables
│   │   │   ├── .env.local        # Local Sanity overrides
│   │   │   └── .env.prod         # Production Sanity config
│   │   ├── auth.config.ts        # NextAuth configuration
│   │   ├── auth.ts               # Authentication setup
│   │   ├── middleware.ts         # Next.js middleware for auth/routing
│   │   ├── next.config.ts        # Next.js configuration
│   │   ├── postcss.config.mjs    # PostCSS configuration
│   │   ├── tailwind.config.ts    # Tailwind CSS configuration
│   │   └── tsconfig.json         # TypeScript configuration
│   └── gofamintui-cms/
│       ├── .sanity/              # Sanity build artifacts
│       ├── schemaTypes/          # Sanity content type definitions
│       ├── static/               # Static CMS assets
│       ├── sanity.cli.ts         # Sanity CLI configuration
│       ├── sanity.config.ts      # Sanity Studio configuration
│       └── tsconfig.json         # TypeScript configuration
├── package.json                  # Root package configuration
├── turbo.json                    # Turborepo configuration
└── README.md                     # This file
```

## 🤝 Contributing

We welcome contributions to GoFamint UI! Here's how to get started:

### Development Process

1. **Fork the Repository**
2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make Your Changes**
4. **Run Tests**
   ```bash
   npm run test
   npm run lint
   npm run type-check
   ```
5. **Commit Your Changes**
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
6. **Push to Your Branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Code Style Guidelines

- Follow TypeScript best practices
- Use meaningful variable and function names
- Write comprehensive tests for new features
- Maintain consistent code formatting (Prettier)
- Follow ESLint rules and configurations

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


## 📞 Support

For support, questions, or feature requests:

- 🐛 **Issues**: [GitHub Issues](https://github.com/TLTechbender/gofamint-ui-app/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/TLTechbender/gofamint-ui-app/discussions)

---

<div align="center">
  <strong>Built with ❤️ by Bolarinwa</strong>
</div>