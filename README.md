<p align="center">
	<img src="https://drive.google.com/uc?export=view&id=157D1c8TFTpM1ivRzzrCvkvAiFVpxdiIb" alt="Nova Reservations Logo" width="160" />
</p>

# Nova Reservations

## Nova Reservations – Project Overview

This workspace hosts three primary applications:

- apps/api – Express + MongoDB backend with Socket.IO
- apps/admin – Admin dashboard (Next.js) for managing hotels, rooms, reservations
- apps/web – Customer-facing site (Next.js) with booking flow and live availability

### Recent Enhancements

- Admin dashboard metrics endpoint `/api/admin/dashboard` integrated and consumed
- Admin tables: search/filter for Rooms & Reservations, improved loading states
- Real-time reservation status updates and room availability via Socket.IO
- Consistent API base URL handling across web/admin clients

### Environment Variables

Create `.env` files in app folders or export shell variables as needed:

- NEXT_PUBLIC_API_BASE_URL (web) → default: http://localhost:4000
- NEXT_PUBLIC_API_URL (admin) → default: http://localhost:4000
- MONGO_URI (api) → your MongoDB connection string
- PORT (api) → default: 4000

### Quick Start

```bash
pnpm install

# Start API first (ensure MONGO_URI is set)
pnpm --filter api dev

# Start Admin and Web apps
pnpm --filter admin dev
pnpm --filter web dev
```

### Notes

- Admin requires `admin_token` in localStorage (set on login) for protected routes.
- Web app listens for `availability:update` events to show live room availability.
- API emits `reservation:status` on updates to keep admin views in sync.

## Using this example

<p>
	<a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node-%3E%3D18-339933?style=flat&logo=node.js&logoColor=white" alt="Node.js" /></a>
	<a href="https://pnpm.io"><img src="https://img.shields.io/badge/pnpm-9.x-F69220?style=flat&logo=pnpm&logoColor=white" alt="pnpm" /></a>
	<a href="https://turbo.build/repo"><img src="https://img.shields.io/badge/TurboRepo-2.x-000000?style=flat&logo=vercel&logoColor=white" alt="TurboRepo" /></a>
	<a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript&logoColor=white" alt="TypeScript" /></a>
	<a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16-000000?style=flat&logo=next.js&logoColor=white" alt="Next.js" /></a>
	<a href="https://www.mongodb.com"><img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb&logoColor=white" alt="MongoDB" /></a>
</p>

## Overview

Nova Reservations is a full-stack, monorepo-based reservation management system designed to streamline hotel, room, transport, and staff operations through a modern, scalable architecture. The platform includes a customer-facing web application, a dedicated admin dashboard, and a secure API backend, all built with performance, maintainability, and real-world usability in mind.

The system supports core reservation features such as room and transport bookings, availability tracking, double-booking prevention, amenities management, staff and role-based access control (RBAC), and real-time administrative oversight. Nova Reservations leverages modern technologies including Next.js, Node.js (Express), TypeScript, MongoDB, and TurboRepo, with a pnpm-based CI/CD pipeline ensuring consistent code quality through automated formatting, linting, type-checking, and builds.

Designed as a production-ready solution, Nova Reservations follows best practices in modular architecture, secure authentication, scalable API design, and continuous integration, making it suitable for real-world deployment as well as academic and professional portfolio use.

## Features

- Booking: rooms and transport with availability tracking
- Double-booking prevention: validation in reservation logic
- Amenities: CRUD and association with rooms/hotels
- Reviews: user-generated ratings and feedback
- Staff management: roles, permissions, and RBAC
- Authentication: JWT-secured endpoints with protected routes
- Admin oversight: dedicated dashboard for operations
- Modular monorepo: shared UI and configs, easy scaling

## Tech Stack

- Frontend: Next.js (Apps: `web`, `admin`)
- Backend: Node.js + Express (App: `api`)
- Language: TypeScript across apps and packages
- Database: MongoDB via Mongoose
- Monorepo: TurboRepo + pnpm workspaces
- Tooling: Biome (format/lint), ESLint (app-level), Zod (validation), JWT (auth)

## Monorepo Structure

```
apps/
	admin/    # Next.js admin dashboard (port 3001)
	web/      # Next.js customer-facing app (port 3000)
	api/      # Express API backend (default port 4000)
packages/
	ui/                 # Shared UI components
	eslint-config/      # Shared ESLint configuration
	typescript-config/  # Shared TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js ≥ 18
- pnpm ≥ 9
- MongoDB (local or Atlas connection string)

### 1) Install dependencies

```bash
pnpm install
```

### 2) Environment configuration

Create an `.env` file in `apps/api`:

```env
MONGO_URI="your-mongodb-connection-string"
JWT_SECRET="your-secure-jwt-secret"
PORT=4000
```

Optionally, set frontend API URL in `apps/web/.env.local` and `apps/admin/.env.local` (recommended for deployment):

```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

### 3) Start development

Start everything via TurboRepo:

```bash
pnpm dev
```

Or run apps individually:

```bash
pnpm dev:api    # API on http://localhost:4000
pnpm dev:web    # Web on http://localhost:3000
pnpm dev:admin  # Admin on http://localhost:3001
```

## Build & Production

Build all apps:

```bash
pnpm build
```

Build specific apps:

```bash
pnpm build:web
pnpm build:admin
```

Run Next.js apps in production:

```bash
pnpm --filter web start    # web on port 3000
pnpm --filter admin start  # admin on port 3001
```

Run the API in production (compiled to `dist/`):

```bash
pnpm --filter api build
node apps/api/dist/server.js
```

## Quality & CI

- Format & lint (Biome across the monorepo):

```bash
pnpm format     # format with Biome
pnpm lint       # lint with Biome
```

- Type-check (TurboRepo orchestrates app checks):

```bash
pnpm typecheck
```

- App-level ESLint (optional, inside Next.js apps):

```bash
pnpm --filter web lint
pnpm --filter admin lint
```

TurboRepo can use remote caching for faster CI; see `turbo.json` for configured pipelines.

## API Overview

Base URL: `http://localhost:4000/api`

Available route groups (REST):

- `/hotels`
- `/rooms`
- `/transports`
- `/reservations`
- `/auth`
- `/users`
- `/staff`
- `/reviews`
- `/amenities`
- `/payments`
- `/availability`

Authentication uses JWT (`Authorization: Bearer <token>`); admin-only routes enforce role checks via RBAC middleware.

## Team

| ID | Name | Email | Responsibility |
| --- | --- | --- | --- |
| 10953038 | Ranabahu Ranabahu | 10953038@students.plymouth.ac.uk | CI/CD Pipeline & Deployment Logs |
| 10953013 | Piyara Morawakaarachchi | 10953013@students.plymouth.ac.uk | Real-Time Booking Status Updates |
| 10953016 | Ekanayake Ekanayake | 10953016@students.plymouth.ac.uk | Room Management |
| 10952878 | Nanayakkara Imasha | 10952878@students.plymouth.ac.uk | Room Search & Availability |
| 10952754 | Pattivila Perera | 10952754@students.plymouth.ac.uk | Testing & Validation |
| 10952995 | Mahayahage Navodya | 10952995@students.plymouth.ac.uk | Booking & Reservation Management |
| 10953673 | Sinethmi Kariyawasam | 10953673@students.plymouth.ac.uk | System Architecture |
| 10953598 | Shavishka Gamage | 10953598@students.plymouth.ac.uk | User Registration, Login & Security |

## Contributing

1. Fork and create a feature branch
2. Run `pnpm format && pnpm typecheck` before committing
3. Open a PR with a clear description and screenshots where relevant

## Acknowledgements

- Built with Next.js, Express, MongoDB, TypeScript, TurboRepo, and pnpm
- Logo provided via Google Drive (if it doesn’t display, ensure public access)

---

Questions or ideas? Feel free to open an issue or start a discussion.
