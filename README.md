# DevBoard - Personal Finance Dashboard

A full-stack personal finance dashboard built with Next.js, Node.js, TypeScript, and PostgreSQL. This application allows users to track income and expenses, visualize spending trends over the last 6 months, and manage transactions in real time.

![Dashboard Preview](https://github.com/Pedrospecian/devboard/blob/main/docs/screenshot-light.png)

🔗 **Live demo:** https://devboard-web-pink.vercel.app

---

## Features

- **Authentication** - JWT-based login and registration with access and refresh tokens
- **Financial summary** - monthly balance, total income, and total expenses at a glance
- **Interactive chart** - bar chart showing income vs. expenses over the last 6 months
- **Transaction management** - create and delete transactions with category and date
- **Dark mode** - full light/dark theme support with persistent preference
- **Responsive layout** - works on desktop and mobile

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 14 (App Router) | Framework and routing |
| TypeScript (strict mode) | Type safety |
| React Query | Server state and cache management |
| Zustand | Client state (auth, theme) |
| Recharts | Data visualization |
| Tailwind CSS | Utility-first styling |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express | REST API |
| TypeScript | Type safety |
| Prisma ORM | Database access with typed queries |
| PostgreSQL | Relational database |
| JSON Web Tokens | Stateless authentication |
| Zod | Runtime schema validation |
| bcryptjs | Password hashing |

---

## Architecture

The project follows a modular architecture on both ends:

**Backend** - each domain (auth, transactions) lives in its own module with a router, controller, service, and schema. The controller handles HTTP concerns, the service holds business logic, and Zod schemas validate all incoming data at the boundary.

**Frontend** - data fetching is fully encapsulated in custom hooks (`useTransactions`, `useSummary`, `useMonthlyChart`) using React Query. UI is composed of small, single-responsibility components. Global state is handled by two Zustand stores: one for auth, one for theme.

```
devboard/
├── apps/
│   ├── web/                  # Next.js frontend
│   │   └── src/
│   │       ├── app/          # Pages (App Router)
│   │       ├── components/   # UI and feature components
│   │       ├── hooks/        # React Query hooks
│   │       ├── providers/    # QueryProvider, ThemeProvider
│   │       ├── store/        # Zustand stores
│   │       └── lib/          # Axios instance
│   └── api/                  # Node.js backend
│       └── src/
│           ├── modules/      # auth, transactions
│           ├── middlewares/  # JWT authentication
│           ├── lib/          # Prisma singleton
│           └── config/       # Environment validation
└── packages/
    └── db/                   # Shared Prisma schema
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16+
- npm or pnpm

### 1. Clone the repository

```bash
git clone https://github.com/Pedrospecian/devboard.git
cd devboard
```

### 2. Set up the backend

```bash
cd apps/api
npm install
```

Create a `.env` file based on the example below:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/devboard"
JWT_SECRET="your-secret-key-at-least-32-characters-long"
JWT_REFRESH_SECRET="another-secret-key-at-least-32-characters"
PORT=3001
NODE_ENV=development
```

Generate JWT secrets securely:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Run database migrations:

```bash
npx prisma migrate dev --name init
```

Start the API server:

```bash
npm run dev
```

The API will be available at `http://localhost:3001`.

### 3. Set up the frontend

```bash
cd apps/web
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth required |
|---|---|---|---|
| POST | `/auth/register` | Create a new user | No |
| POST | `/auth/login` | Authenticate and receive tokens | No |
| POST | `/auth/refresh` | Refresh access token | No |
| GET | `/auth/me` | Get current user | Yes |

### Transactions
| Method | Endpoint | Description | Auth required |
|---|---|---|---|
| GET | `/transactions` | List all transactions | Yes |
| GET | `/transactions/summary` | Get monthly summary | Yes |
| GET | `/transactions/chart` | Get 6-month chart data | Yes |
| POST | `/transactions` | Create a transaction | Yes |
| DELETE | `/transactions/:id` | Delete a transaction | Yes |

---

## Key Technical Decisions

**Why React Query instead of useEffect + useState?**
React Query handles caching, background refetching, and loading/error states out of the box. After a mutation (create or delete), invalidating the relevant query keys automatically triggers a refetch, which means that no manual state sync is needed.

**Why Zustand instead of Redux?**
For this scale of application, Redux adds boilerplate without meaningful benefit. Zustand provides a minimal API with the same predictability, and integrates cleanly with TypeScript without extra configuration.

**Why Prisma ORM?**
Prisma generates a fully typed client from the schema, which means database queries are type-checked at compile time. This eliminates an entire class of runtime errors and makes refactoring safer.

**Why Zod for validation?**
Zod validates request data at the API boundary and infers TypeScript types from schemas, keeping validation logic and type definitions in a single source of truth.

---

## Roadmap

- [x] Filter transactions by month and category
- [x] Export transactions to CSV
- [x] Unit and integration tests (Vitest + Testing Library)
- [x] Docker Compose setup for local development
- [x] CI/CD pipeline with GitHub Actions

---

## License

MIT
