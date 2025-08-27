# GoFamint UI

> A modern, full-stack web application built with Next.js and Sanity CMS for Gofamint Students Fellowship, University of Ibadan

## Table of Contents

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

## Overview

GoFamint UI is a modern, full-stack web application designed with scalability, performance and developer experience in mind. It features a Next.js frontend application with server actions and a Sanity CMS for content management.

### Key Features

- Modern Stack: Next.js 15+ with App Router and Server Actions
- Beautiful UI: Tailwind CSS for responsive design and fast development
- Authentication: NextAuth.js with custom middleware and Google OAuth
- Content Management: Sanity Studio with custom schema types
- Type Safety: Full TypeScript implementation
- Email Integration: SMTP configuration for notifications
- Database: Prisma ORM with custom middleware
- Server Actions: Modern data fetching without traditional API routes
- Custom Hooks: Reusable React hooks for common functionality

## Architecture

```
gofamint-ui/
├── app/                   # App Router directory
├── components/            # Reusable React components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions & configurations
├── prisma/                # Database schema & migrations
├── public/                # Static assets
├── sanity/                # Sanity client & schemas
├── actions/               # Server Actions (replaces API routes)
├── package.json           # Package configuration
├── next.config.js         # Next.js configuration
└── README.md              # Project documentation
```

## Tech Stack

### Frontend
- **Framework**: [Next.js 15+](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 
- **Database**: [Prisma ORM](https://prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) with custom auth configuration
- **Content**: Sanity CMS integration with custom schemas
- **API Layer**: React Server Actions + API routes
- **State Management**: React Server Components + Server Actions
- **Middleware**: Custom authentication and routing middleware

### CMS
- **Platform**: [Sanity Studio](https://sanity.io/)
- **Language**: TypeScript
- **Schema Types**: Custom content type definitions
- **Template**: Clean, production-ready setup
- **Environment**: Production dataset with webhook integration

### Development & Tooling
- **Package Manager**: npm
- **Linting**: ESLint with TypeScript support
- **Formatting**: Prettier
- **Containerization**: Docker (planned)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0
- **npm** >= 10.0.0
- **Git** for version control
- **Docker** (optional, for containerized development)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/TLTechbender/gofamint-ui-app.git
cd gofamint-ui-app
```

### 2. Install Dependencies

```bash
# Install all dependencies
npm install
```

### 3. Environment Setup

Create environment files:

```bash
# Copy example environment file
cp .env.example .env.local
```

Configure your environment variables (see [Environment Variables](#environment-variables) section).

## Development

### Start Development Server

```bash
# Start the Next.js application in development mode
npm run dev
```

This will start the Next.js App at http://localhost:3000

## Building

### Build Application

```bash
# Build the application
npm run build
```

### Start Production Server

```bash
# Start the built application
npm start
```

## Deployment

The application is designed to be platform-agnostic but optimized for Vercel deployment.

### Manual Deployment

```bash
# Build the application
npm run build

# The built application will be in .next/
```

## Environment Variables

### Next.js App (`.env.local`)

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

## Scripts Reference

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build the application |
| `npm run start` | Start production server |
| `npm run lint` | Lint the codebase |
| `npm run lint:fix` | Lint and fix issues |
| `npm run type-check` | TypeScript type checking |

## Docker Support

Docker configuration is planned for future implementation.

When implemented, Docker support will include:

- **Development Environment**: Container setup with hot reloading
- **Production Environment**: Optimized containers for deployment
- **Database Services**: PostgreSQL/MySQL container integration
- **Nginx Proxy**: Load balancing and SSL termination

### Planned Docker Structure

```
docker/
├── app.Dockerfile          # Next.js app container
├── docker-compose.yml      # Development setup
└── docker-compose.prod.yml # Production setup
```

## Project Structure

```
gofamint-ui/
├── .next/                    # Next.js build output
├── actions/                  # Server Actions (modern API layer)
├── app/                      # Next.js App Router pages & layouts
├── components/               # Reusable React UI components
├── hooks/                    # Custom React hooks
├── lib/                      # Utility functions & configurations
├── prisma/                   # Database schema & migrations
├── public/                   # Static assets (images, icons, etc.)
├── sanity/                   # Sanity client configuration & schemas
├── auth.config.ts            # NextAuth configuration
├── auth.ts                   # Authentication setup
├── middleware.ts             # Next.js middleware for auth/routing
├── next.config.js            # Next.js configuration
├── postcss.config.mjs        # PostCSS configuration
├── tailwind.config.ts        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## Contributing

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

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Support

For support, questions, or feature requests:

- Issues: [GitHub Issues](https://github.com/TLTechbender/gofamint-ui-app/issues)
- Discussions: [GitHub Discussions](https://github.com/TLTechbender/gofamint-ui-app/discussions)

---

Built with care by Bolarinwa and DevQing