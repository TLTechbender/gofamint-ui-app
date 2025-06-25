# GoFamint - Wrting the Lord's code

This contains all the code for the Lord's web app, I would most likely document it too bro.

## 🏗️ Architecture Overview

```
gofamint/
├── packages/
│   ├── gofamintui-app/         # Next.js 15+ Frontend Application
│   └── gofamintui-cms/         # Sanity Studio CMS
├── docker/                     # Docker configuration for portability
├── scripts/                    # Shared build/deployment scripts if any
├── package.json               # Root package.json with workspaces
├── turbo.json                 # Turborepo configuration
├── docker-compose.yml         # Multi-service Docker setup
└── README.md                  # This file
```

## 📦 Packages

### `gofamintui-app` - Frontend Application

- **Framework**: Next.js 15+ with App Router
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Content**: Sanity CMS integration
- **Deployment**: Vercel-ready

### `gofamintui-cms` - Content Management System

- **Framework**: Sanity Studio (Latest)
- **TypeScript**: Full type safety
- **Template**: Clean template
- **Dataset**: Production environment

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Docker (optional)

### Installation

```bash
# Clone the repository
git clone <https://github.com/TLTechbender/gofamint-ui-app.git>
cd gofamint

# Install all dependencies for all packages that my app would be running
npm run install:all

# Set up environment variables
cp packages/gofamintui-app/.env.example packages/gofamintui-app/.env.local
cp packages/gofamintui-cms/.env.example packages/gofamintui-cms/.env.local
```

### Development

```bash
# Start all services in development mode
npm run dev

# Start individual services
npm run dev:app        # Next.js app only
npm run dev:cms        # Sanity studio only

# Build all packages
npm run build

# Run tests across all packages
npm run test
```

## 🐳 Docker Support (When I am done building, I will set this up but rn It's all ust empty)

### Development Environment

```bash
# Start all services with Docker
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Deployment

```bash
# Build production images
docker build -f docker/app.Dockerfile -t gofamint-app .
docker build -f docker/cms.Dockerfile -t gofamint-cms .

# Run production containers
docker run -p 3000:3000 gofamint-app
docker run -p 3333:3333 gofamint-cms
```

## 📝 Available Scripts

### Root Level

- `npm run dev` - Start all services in development
- `npm run build` - Build all packages
- `npm run clean` - Clean all build artifacts
- `npm run lint` - Lint all packages
- `npm run test` - Run tests across all packages

### Package Specific

- `npm run dev:app` - Start Next.js app
- `npm run dev:cms` - Start Sanity studio
- `npm run build:app` - Build Next.js app
- `npm run build:cms` - Build Sanity studio

## 🚀 Deployment

This is most likely gonna be on vercel, but I'm gonna do it in a way that I'm not locked into vercel in case we decide to use another provider in future

```
gofamint-ui-app
├─ .turbo
│  ├─ cache
│  │  ├─ 0896b7dab5d9604e-meta.json
│  │  ├─ 0896b7dab5d9604e.tar.zst
│  │  ├─ 1e0bce54616ec91b-meta.json
│  │  └─ 1e0bce54616ec91b.tar.zst
│  ├─ cookies
│  │  └─ 1.cookie
│  └─ daemon
├─ feature-guide.jpg
├─ package-lock.json
├─ package.json
├─ packages
│  ├─ gofamintui-app
│  │  ├─ actions
│  │  │  ├─ blogPage.ts
│  │  │  └─ footer.ts
│  │  ├─ app
│  │  │  ├─ about
│  │  │  │  └─ page.tsx
│  │  │  ├─ blog
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ [slug]
│  │  │  │     └─ page.tsx
│  │  │  ├─ contact
│  │  │  │  └─ page.tsx
│  │  │  ├─ events
│  │  │  │  └─ page.tsx
│  │  │  ├─ executives
│  │  │  │  └─ page.tsx
│  │  │  ├─ favicon.ico
│  │  │  ├─ gallery
│  │  │  │  └─ page.tsx
│  │  │  ├─ giving
│  │  │  │  └─ page.tsx
│  │  │  ├─ globals.css
│  │  │  ├─ layout.tsx
│  │  │  ├─ live
│  │  │  │  └─ page.tsx
│  │  │  ├─ page.tsx
│  │  │  └─ sermons
│  │  │     └─ page.tsx
│  │  ├─ components
│  │  │  ├─ blogsPageClient.tsx
│  │  │  ├─ calendarComponent.tsx
│  │  │  ├─ contactInformationComponent.tsx
│  │  │  ├─ footer.tsx
│  │  │  ├─ galleryClient.tsx
│  │  │  ├─ galleryListClient.tsx
│  │  │  ├─ infiniteScrollContainer.tsx
│  │  │  ├─ journeyPlanner.tsx
│  │  │  ├─ liveComponent.tsx
│  │  │  ├─ navbar.tsx
│  │  │  ├─ onlineGivingComponent.tsx
│  │  │  ├─ reactQueryProvider.tsx
│  │  │  ├─ reactToastifyProvider.tsx
│  │  │  ├─ sermonComponent.tsx
│  │  │  ├─ sermonsPageClient.tsx
│  │  │  └─ shareButtonComponent.tsx
│  │  ├─ eslint.config.mjs
│  │  ├─ hooks
│  │  │  ├─ useBlogPages.tsx
│  │  │  ├─ useCalendar.tsx
│  │  │  ├─ useGalleryList.tsx
│  │  │  ├─ useGalleryPage.tsx
│  │  │  └─ useInfiniteSermons.tsx
│  │  ├─ lib
│  │  │  └─ dateFormatters.ts
│  │  ├─ next-env.d.ts
│  │  ├─ next.config.ts
│  │  ├─ package.json
│  │  ├─ postcss.config.mjs
│  │  ├─ public
│  │  │  ├─ file.svg
│  │  │  ├─ globe.svg
│  │  │  ├─ gsf-ui-logo.png
│  │  │  ├─ hero-img.jpg
│  │  │  ├─ message.png
│  │  │  ├─ next.svg
│  │  │  ├─ vercel.svg
│  │  │  └─ window.svg
│  │  ├─ README.md
│  │  ├─ sanity
│  │  │  ├─ api.ts
│  │  │  ├─ interfaces
│  │  │  │  ├─ aboutPage.ts
│  │  │  │  ├─ blogComments.ts
│  │  │  │  ├─ blogPost.ts
│  │  │  │  ├─ blogPosts.ts
│  │  │  │  ├─ contact.ts
│  │  │  │  ├─ events.ts
│  │  │  │  ├─ excecutivesPage.ts
│  │  │  │  ├─ footerContent.ts
│  │  │  │  ├─ galleryListPage.ts
│  │  │  │  ├─ galleryPage.ts
│  │  │  │  ├─ homePage.ts
│  │  │  │  ├─ onlineGiving.ts
│  │  │  │  ├─ sanityImage.ts
│  │  │  │  ├─ sermonsPage.ts
│  │  │  │  └─ streaming.ts
│  │  │  ├─ queries
│  │  │  │  ├─ aboutPage.ts
│  │  │  │  ├─ aboutPageMetaData.ts
│  │  │  │  ├─ blogPage.ts
│  │  │  │  ├─ blogPageMetaData.ts
│  │  │  │  ├─ blogsPage.ts
│  │  │  │  ├─ contact.ts
│  │  │  │  ├─ events.ts
│  │  │  │  ├─ excecutivesPage.ts
│  │  │  │  ├─ footerContent.ts
│  │  │  │  ├─ galleryListPage.ts
│  │  │  │  ├─ galleryPage.ts
│  │  │  │  ├─ homePage.ts
│  │  │  │  ├─ homePageMetaData.ts
│  │  │  │  ├─ onlingGiving.ts
│  │  │  │  ├─ sermonsPage.ts
│  │  │  │  └─ streaming.ts
│  │  │  ├─ sanityClient.ts
│  │  │  └─ sanityCRUDHandlers.ts
│  │  ├─ styles
│  │  │  └─ gallery.css
│  │  └─ tsconfig.json
│  └─ gofamintui-cms
│     ├─ .sanity
│     │  └─ runtime
│     │     ├─ app.js
│     │     └─ index.html
│     ├─ eslint.config.mjs
│     ├─ package.json
│     ├─ README.md
│     ├─ sanity.cli.ts
│     ├─ sanity.config.ts
│     ├─ schemaTypes
│     │  ├─ documents
│     │  │  ├─ aboutPage.ts
│     │  │  ├─ author.ts
│     │  │  ├─ blogs.ts
│     │  │  ├─ contact.ts
│     │  │  ├─ events.ts
│     │  │  ├─ excecutives.ts
│     │  │  ├─ footerContent.ts
│     │  │  ├─ gallery.ts
│     │  │  ├─ homePage.ts
│     │  │  ├─ onlineGiving.ts
│     │  │  ├─ sermonsPage.ts
│     │  │  └─ streaming.ts
│     │  └─ index.ts
│     ├─ static
│     └─ tsconfig.json
├─ README.md
└─ turbo.json

```