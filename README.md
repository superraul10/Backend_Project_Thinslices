# Recipe Backend

A TypeScript/Express REST API for user accounts and recipes, backed by Supabase (Postgres + Storage), with JWT authentication, Zod request validation, and a Vitest test suite.

## Tech stack

- Node.js 26, TypeScript, ESM
- Express 5
- Supabase (Postgres + Storage), managed locally via the Supabase CLI
- JWT auth (`jsonwebtoken`) + `bcrypt` password hashing
- Zod for request validation
- Multer for multipart photo uploads
- Vitest + Supertest for unit and integration tests

## Project structure

Code is organized by domain, with each layer (controllers, routes, middleware, repositories, services) split into `auth/` and `recipes/` subfolders:

```
src/
  app.ts                  Express app (exported for tests)
  index.ts                Entry point — starts the server
  config/dbConnection.ts  Supabase client
  controllers/
    auth/                 Login/register request handlers
    recipes/              Recipe CRUD + photo request handlers
  routes/
    auth/                  /auth routes
    recipes/               /recipes routes
  middleware/
    auth/verifyJWT.ts      Protects routes, attaches req.user
    recipes/upload.ts      Multer config for photo uploads
    zodValidator.ts        Generic req.body validation middleware
  repositories/
    auth/                  users, refresh tokens
    recipes/               recipes table, Storage bucket uploads
  services/
    auth/                  login, register business logic
    recipes/               add/get/update/delete recipe, photo upload logic
  types/
    AppError.ts            Typed HTTP error, thrown by services
    recipes/Recipe.ts      Zod schemas + inferred types
    express.d.ts           Augments Request with req.user
  utils/jwt.ts              Sign/verify JWTs

scripts/seed.ts            Populates the local DB with sample users/recipes
tests/
  unitTesting/             Service-layer tests with mocked repositories
  integrationTesting/      Full HTTP tests via Supertest against a real DB
supabase/migrations/       Database schema (source of truth)
.github/workflows/test.yml CI: runs tsc + the test suite on every push/PR
```

## Prerequisites

- Node.js 26+
- Docker (required to run the local Supabase stack)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the project root (see [Environment variables](#environment-variables) below).
3. Start the local Supabase stack (builds the database from `supabase/migrations/`):
   ```bash
   npx supabase start
   ```
   This prints an `API URL` and `service_role`/`secret` key — use these for `SUPABASE_URL` / `SUPABASE_SECRET_KEY` in `.env`.
4. Start the dev server:
   ```bash
   npm run dev
   ```
   The API is now available at `http://localhost:3000`.

## Environment variables

| Variable               | Description                                           |
|-------------------------|--------------------------------------------------------|
| `SUPABASE_URL`          | Local or hosted Supabase API URL                       |
| `SUPABASE_SECRET_KEY`   | Supabase service-role/secret key                        |
| `ACCESS_TOKEN_SECRET`   | Secret used to sign short-lived access tokens (1h)      |
| `REFRESH_TOKEN_SECRET`  | Secret used to sign refresh tokens (1d)                  |

## Available scripts

| Command           | Description                                              |
|--------------------|------------------------------------------------------------|
| `npm run dev`      | Start the dev server with hot reload (`tsx watch`)          |
| `npm run build`    | Type-check and compile to `dist/`                            |
| `npm start`        | Run the compiled server (`node dist/index.js`)                |
| `npm run seed`     | Populate the local DB with sample users and recipes             |
| `npm test`         | Run the Vitest suite (unit + integration)                       |

## API reference

All request/response bodies are JSON unless noted. Protected routes require `Authorization: Bearer <accessToken>`.

### Auth

| Method | Path             | Auth | Body                          |
|--------|------------------|------|--------------------------------|
| POST   | `/auth/register` | —    | `{ username, password }`       |
| POST   | `/auth/login`    | —    | `{ username, password }` → `{ accessToken }` |

### Recipes

| Method | Path                    | Auth | Body / Notes |
|--------|-------------------------|------|--------------|
| POST   | `/recipes`              | Yes  | `{ title, ingredients: string[], steps, prepTime, photoUrl? }` |
| GET    | `/recipes`              | Yes  | Lists recipes belonging to the authenticated user |
| GET    | `/recipes/:id`          | Yes  | Fetch one recipe by id |
| PATCH  | `/recipes/:id`          | Yes  | Any subset of the create fields; at least one required |
| DELETE | `/recipes/:id`          | Yes  | Deletes a recipe by id |
| POST   | `/recipes/:id/images`   | Yes  | `{ imageUrl }` — attach an already-hosted photo URL |
| POST   | `/recipes/:id/photo`    | Yes  | `multipart/form-data`, field name `photo` — uploads a real image file to Supabase Storage and sets `photo_url` |

## Database

The schema lives entirely in `supabase/migrations/` — this is the source of truth, and `supabase start` / `supabase db reset` rebuild the local database from it. Don't edit the schema by hand in Supabase Studio without also writing a migration, or the tracked schema will drift from reality.

## Testing

```bash
npm test
```

- **Unit tests** (`tests/unitTesting/`) mock the repository layer and test service business logic in isolation — no database required.
- **Integration tests** (`tests/integrationTesting/`) drive the real app through Supertest against your local Supabase instance — `npx supabase start` must be running first.

## CI

`.github/workflows/test.yml` runs on every push and pull request: installs dependencies, starts a fresh local Supabase stack from the migrations, type-checks, and runs the full test suite.

