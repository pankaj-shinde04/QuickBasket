# QuickBasket Server

Node.js + Express + MongoDB backend for the QuickBasket marketplace.

## Prerequisites

- Node.js 18+
- MongoDB running locally (or a remote `MONGODB_URI`)

## Setup

```bash
cd server
cp .env.example .env
npm install
```

Edit `.env` with your MongoDB URI and JWT secret.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with nodemon |
| `npm start` | Start production server |
| `npm run seed` | Seed demo users matching the frontend |

## Demo accounts

| Email | Password | Role |
|-------|----------|------|
| customer@quickbasket.com | Test@1234 | customer |
| owner@quickbasket.com | Test@1234 | shop_owner |
| admin@quickbasket.com | Test@1234 | admin |

## API

- Health: `GET /api/health`

Default port: **5000**

## Folder structure

```
server/
├── src/
│   ├── config/       # env + database
│   ├── controllers/  # route handlers (per module)
│   ├── middleware/   # auth, validation, errors
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API routes
│   ├── seeds/        # bootstrap data
│   ├── services/     # business logic
│   └── utils/        # shared helpers
└── uploads/          # product images
```

See `BACKEND_DEVELOPMENT.md` at the repo root for the full module-by-module build plan.
