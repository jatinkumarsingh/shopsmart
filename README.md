# ShopSmart - Full Stack E-Commerce Platform

> A modern, production-ready e-commerce application built with React, Node.js, and PostgreSQL. Deploy to Vercel with automated CI/CD pipelines.

[![Lint & Test](https://github.com/jatinkumarsingh/shopsmart/actions/workflows/lint-test.yml/badge.svg)](https://github.com/jatinkumarsingh/shopsmart/actions)
[![Build & Deploy](https://github.com/jatinkumarsingh/shopsmart/actions/workflows/build.yml/badge.svg)](https://github.com/jatinkumarsingh/shopsmart/actions)

## ✨ Features

### 🛍️ E-Commerce Core
- Browse and search for tech products
- User authentication with JWT
- Secure checkout flow
- Product cart management
- Admin controls for inventory

### 🏗️ Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React 18 + Vite | Latest |
| **Backend** | Node.js + Express 5 | LTS |
| **Database** | PostgreSQL 16 | Neon Cloud |
| **ORM** | Prisma 5.22 | Latest |
| **Auth** | JWT (jsonwebtoken) | 9.0.3 |
| **Deployment** | Vercel | Serverless |

### 🔒 Security Features
- JWT-based authentication
- Password hashing with bcryptjs
- Protected API routes
- CORS enabled
- Environment variable management

### ✅ Quality Assurance
- **Frontend Testing**: Vitest + React Testing Library
- **Backend Testing**: Jest + Supertest
- **E2E Testing**: Playwright
- **Linting**: ESLint + Prettier (both client & server)
- **Automated CI/CD**: GitHub Actions

---

## 📋 Prerequisites

- **Node.js**: 20.x or higher
- **npm**: 10.x or higher
- **Git**: For version control
- **PostgreSQL Database**: Neon, Supabase, Railway, or local

---

## 🚀 Quick Start

### Clone & Setup

```bash
git clone https://github.com/jatinkumarsingh/shopsmart.git
cd shopsmart
```

### Backend Setup

```bash
cd server

# Install dependencies
npm install

# Configure environment variables
# Copy .env.example to .env and update DATABASE_URL and JWT_SECRET
cp .env.example .env

# Run database migrations
npm run db:migrate:deploy

# Seed database with sample products
npm run db:seed

# Start development server
npm run dev
```

**Backend runs on:** `http://localhost:5001`

### Frontend Setup

```bash
cd ../client

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend runs on:** `http://localhost:5173`

### Access the Application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5001 |
| API Health | http://localhost:5001/api/health |

---

## 📁 Project Structure

```
shopsmart/
├── .github/
│   └── workflows/
│       ├── lint-test.yml      # Linting & testing pipeline
│       └── build.yml          # Build validation
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/            # Page components
│   │   ├── context/          # Context API (Auth, Cart, Notifications)
│   │   ├── utils/            # API client, helpers
│   │   └── App.jsx
│   ├── test/                 # Unit tests
│   ├── tests/                # E2E tests (Playwright)
│   ├── vite.config.js
│   └── package.json
├── server/                     # Node.js backend
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Auth middleware, etc.
│   │   ├── app.js           # Express app
│   │   └── index.js         # Server entry point
│   ├── api/
│   │   └── index.js         # Vercel serverless entry
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── migrations/      # Migration history
│   ├── tests/               # Unit & integration tests
│   ├── seed.js              # Database seeding
│   └── package.json
├── vercel.json              # Vercel deployment config
├── compose.yml              # Docker Compose (optional)
└── README.md
```

---

## 🛠️ Available Commands

### Backend

```bash
npm run dev              # Start development server with hot reload
npm run start           # Run production server
npm run build           # Generate Prisma client & run migrations
npm run test            # Run all tests (Jest)
npm run test:int        # Run integration tests only
npm run lint            # Check code quality (ESLint)
npm run format:fix      # Format code (Prettier)
npm run db:generate     # Generate Prisma client
npm run db:migrate:deploy   # Run pending migrations
npm run db:seed         # Seed database with sample data
```

### Frontend

```bash
npm run dev             # Start development server
npm run build           # Build for production
npm run preview         # Preview production build
npm run test            # Run unit tests (Vitest)
npm run test:e2e        # Run end-to-end tests (Playwright)
npm run lint            # Check code quality (ESLint)
npm run format:fix      # Format code (Prettier)
```

---

## 🔐 Environment Variables

### Backend (`server/.env`)

```env
# PostgreSQL connection string
DATABASE_URL=postgresql://user:password@host:port/database

# JWT secret (use a strong random string for production)
JWT_SECRET=your_super_secret_jwt_key_here

# Server port (optional, defaults to 5001)
PORT=5001
```

### Frontend (`client/.env`)

```env
# Backend API URL
# Local: http://localhost:5001
# Production: https://your-backend-domain.vercel.app
VITE_API_URL=http://localhost:5001
```

See `.env.example` files in each directory for templates.

---

## 🧪 Testing & Quality

### Run Tests

```bash
# Backend
cd server && npm test

# Frontend
cd client && npm test

# E2E Tests
cd client && npm run test:e2e
```

### Run Linting

```bash
# Backend
cd server && npm run lint

# Frontend
cd client && npm run lint

# Fix formatting
npm run format:fix
```

### GitHub Actions

Two automated workflows run on every push:

1. **Lint & Test** (`.github/workflows/lint-test.yml`)
   - Runs ESLint on both projects
   - Executes Jest & Vitest test suites
   - Provides real-time feedback on pull requests

2. **Build** (`.github/workflows/build.yml`)
   - Builds both frontend & backend
   - Validates all tests pass
   - Ensures code quality checks succeed

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (protected)
- `PUT /api/products/:id` - Update product (protected)
- `DELETE /api/products/:id` - Delete product (protected)

### Health
- `GET /api/health` - Server health check

---

## 📦 Deployment

### Deploy to Vercel

#### Frontend Deployment

1. Go to [vercel.com](https://vercel.com)
2. Connect GitHub repository
3. Configure project:
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variable:
   - `VITE_API_URL`: Your backend URL
5. Deploy!

#### Backend Deployment

1. Create new Vercel project
2. Connect same GitHub repository
3. Configure project:
   - **Root Directory**: `server`
   - **Build Command**: `npm run build`
   - **Output Directory**: `api`
4. Add environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: A secure random string
5. Deploy!

#### Important Notes

- Backend runs as **serverless functions** on Vercel
- Database must be hosted separately (Neon, Supabase, etc.)
- Update frontend `VITE_API_URL` after backend deployment
- Use `vercel.json` for monorepo/multi-project configuration

---

## 🐳 Docker (Optional)

The project includes Docker configuration for local containerized development.

```bash
# Start all services (database, API, web)
docker compose up --build

# Access:
# - Frontend: http://localhost
# - Backend: http://localhost:5001
```

---

## 📚 Database Schema

### User Model
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Product Model
```prisma
model Product {
  id          String   @id @default(uuid())
  name        String
  description String
  price       Float
  imageUrl    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Quality Standards

- All code must pass linting checks
- Tests must pass for new features
- Use meaningful commit messages
- Follow existing code style

---

## 📝 License

This project is open source and available under the MIT License.

---

## 🚀 Performance Tips

- Frontend uses **Vite** for fast bundling
- API responses are **JSON** optimized
- Database indexes on frequently queried fields
- JWT tokens cached in localStorage
- CORS configured for allowed origins

---

## 🔧 Troubleshooting

### Backend won't start
```bash
# Check database connection
DATABASE_URL=your_url npm run db:migrate:deploy

# Regenerate Prisma client
npm run db:generate
```

### Frontend shows "API connection failed"
```bash
# Verify backend is running on port 5001
lsof -i :5001

# Check VITE_API_URL in client/.env
cat client/.env
```

### Port already in use
```bash
# Kill process on port 5001
lsof -ti:5001 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

---

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check existing issues first
- Provide detailed error messages
- Include environment details

---

**Made with ❤️ by Jatin Kumar Singh**
