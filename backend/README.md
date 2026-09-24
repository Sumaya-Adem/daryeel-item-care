# Daryeel API (Backend) — Phase 1

Express + TypeScript + PostgreSQL + Prisma foundation for Daryeel. This folder is fully separate from the frontend (which lives at the project root).

## 1. Requirements
- Node.js **20 or newer** (22 LTS recommended) — check with `node -v`
- npm
- PostgreSQL **14 or newer**

## 2. PostgreSQL setup
Install PostgreSQL (https://www.postgresql.org/download/) or run it with Docker:

```sh
docker run --name daryeel-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=daryeel -p 5432:5432 -d postgres:16
```

Or create the database manually: `createdb daryeel`

## 3. Create the .env file
```sh
cd backend
cp .env.example .env
```

## 4. Configure DATABASE_URL
Format: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public`

Example: `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/daryeel?schema=public"`

Never commit `.env` — it is already in `.gitignore`.

## 5. Install dependencies
```sh
npm install
```

## 6. Initialize Prisma
```sh
npm run prisma:validate   # checks prisma/schema.prisma
npm run prisma:generate   # generates the Prisma Client
npm run db:test           # verifies the PostgreSQL connection
```
`db:test` prints `Connected to PostgreSQL successfully.` when everything is correct.

## 7. Run the development server
```sh
npm run dev
```
Restarts automatically when files change. Default port: 5000.

## 8. Test the health endpoint
Open http://localhost:5000/api/health or:
```sh
curl http://localhost:5000/api/health
# {"success":true,"message":"Daryeel API is running"}
```
Unknown routes return `404 {"success":false,"message":"Route not found"}`.

## 9. Build
```sh
npm run build
```
Output goes to `dist/`.

## 10. Start the production build
```sh
NODE_ENV=production npm run start
```

## Structure
```
src/
  controllers/   request handlers
  routes/        route definitions (mounted under /api)
  middleware/    404 + centralized error handler
  services/      Prisma client and data access
  utils/         env loading, errors, db test script
  app.ts         Express app setup (CORS, JSON, routes)
  server.ts      starts the server
prisma/schema.prisma
```

## CORS
Allowed origins come from `CORS_ORIGINS` in `.env` (comma-separated). Default: `http://localhost:5173`.
