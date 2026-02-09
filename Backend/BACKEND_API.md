# Movie Streaming Backend — API Documentation

> **Version:** 1.0.0  
> **Base URL:** `http://localhost:4000/api/v1`  
> **Stack:** Node.js · TypeScript · Express · Supabase · Redis · TMDB · NewsAPI

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Getting Started](#getting-started)
3. [Authentication Flow](#authentication-flow)
4. [API Endpoints](#api-endpoints)
   - [Health](#health)
   - [Auth](#auth)
   - [Movies](#movies)
   - [Search](#search)
   - [Watchlists](#watchlists)
   - [News](#news)
5. [Error Format](#error-format)
6. [Caching Strategy](#caching-strategy)
7. [Rate Limiting](#rate-limiting)
8. [Security Notes](#security-notes)
9. [Frontend Integration Guide](#frontend-integration-guide)
10. [Database Schema](#database-schema)

---

## Architecture Overview

```
Client (React / Mobile)
    │
    ▼
┌───────────────────────────────────────────┐
│   Express API  (Node.js + TypeScript)     │
│   ┌─────────────────────────────────────┐ │
│   │ Middleware: CORS, Helmet, Rate Limit │ │
│   │ Auth: Supabase JWT verification      │ │
│   │ Validation: Zod schemas             │ │
│   └─────────────────────────────────────┘ │
│       │             │            │        │
│   Supabase       TMDB API    NewsAPI      │
│   (Postgres)     (movies)    (articles)   │
│       │                                   │
│     Redis (cache layer)                   │
└───────────────────────────────────────────┘
```

### Folder Structure

```
Backend/
├── src/
│   ├── index.ts                  # Entry point
│   ├── app.ts                    # Express app setup
│   ├── config/
│   │   ├── env.ts                # Env validation (Zod)
│   │   ├── logger.ts             # Pino structured logger
│   │   ├── redis.ts              # Redis client
│   │   └── supabase.ts           # Supabase clients
│   ├── middleware/
│   │   ├── auth.ts               # JWT verification + RBAC
│   │   ├── errorHandler.ts       # Central error handler
│   │   ├── rateLimiter.ts        # Rate limiting
│   │   ├── requestId.ts          # Request correlation IDs
│   │   ├── security.ts           # Helmet + CORS
│   │   └── validate.ts           # Zod validation middleware
│   ├── routes/                   # Route definitions
│   ├── controllers/              # Request handlers
│   ├── services/                 # Business logic + external APIs
│   ├── schemas/                  # Zod validation schemas
│   ├── types/                    # TypeScript types
│   └── utils/                    # Utilities (ApiError, sanitize)
├── db/migrations/                # SQL migrations
├── docker-compose.yml            # Redis container
├── package.json
├── tsconfig.json
└── .env.example
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **Docker** (for Redis) or a remote Redis instance
- **Supabase** project (cloud or local)

### Setup (Windows)

```powershell
# 1. Clone and enter the backend
cd Backend

# 2. Install dependencies
npm install

# 3. Copy environment file and fill in your keys
copy .env.example .env
# Edit .env with your actual values

# 4. Start Redis
docker compose up -d

# 5. Run database migration
# Go to Supabase Dashboard → SQL Editor → paste db/migrations/001_initial_schema.sql → Run

# 6. Start development server
npm run dev

# 7. Verify
curl http://localhost:4000/api/v1/health
```

### Scripts

| Script         | Command            | Description                  |
| -------------- | ------------------ | ---------------------------- |
| `npm run dev`  | `tsx watch src/…`  | Dev server with hot reload   |
| `npm run build`| `tsc`              | Compile TypeScript           |
| `npm start`    | `node dist/…`      | Run production build         |
| `npm run lint` | `eslint src`       | Lint source                  |
| `npm test`     | `vitest run`       | Run tests                    |

---

## Authentication Flow

This backend uses **Supabase Auth**. JWTs are issued by Supabase, and the backend **verifies** them.

### How it works

1. **Frontend** calls Supabase Auth SDK to sign up / sign in:
   ```ts
   const { data } = await supabase.auth.signInWithPassword({ email, password });
   const accessToken = data.session.access_token;
   ```

2. **Frontend** sends the access token in every backend request:
   ```
   Authorization: Bearer <access_token>
   ```

3. **Backend** verifies the JWT via `supabase.auth.getUser(token)` and loads the user profile (including role).

4. **Token refresh** is handled client-side by the Supabase SDK (automatic).

### Role-Based Access Control (RBAC)

| Role    | Permissions                                   |
| ------- | --------------------------------------------- |
| `user`  | Manage own watchlists, view movies/news       |
| `admin` | All `user` permissions + admin endpoints      |

Roles are stored in the `profiles` table and set to `user` by default on registration.

---

## API Endpoints

All responses follow the envelope format:
```json
{ "data": { ... } }
```

### Health

#### `GET /api/v1/health`

No auth required.

**Response `200`**
```json
{
  "status": "ok",
  "version": "1.0.0",
  "uptime": 12345,
  "timestamp": "2026-02-09T12:00:00.000Z"
}
```

---

### Auth

#### `GET /api/v1/auth/me`

🔒 Requires `Authorization: Bearer <token>`

Returns the authenticated user's profile.

**Response `200`**
```json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "user",
    "created_at": "2026-01-01T00:00:00Z",
    "updated_at": "2026-01-01T00:00:00Z"
  }
}
```

**Errors:** `401 UNAUTHORIZED`

---

### Movies

All movie endpoints are **public** (no auth required). Data is sourced from TMDB and cached in Redis.

#### `GET /api/v1/movies/trending`

| Query Param   | Type   | Default | Description                |
| ------------- | ------ | ------- | -------------------------- |
| `page`        | int    | `1`     | Page number (1–500)        |
| `time_window` | string | `day`   | `day` or `week`            |

**Response `200`**
```json
{
  "data": {
    "results": [ { "id": 123, "title": "...", "poster_path": "...", ... } ],
    "page": 1,
    "total_pages": 50,
    "total_results": 1000
  }
}
```

#### `GET /api/v1/movies/popular`

| Query Param | Type | Default | Description          |
| ----------- | ---- | ------- | -------------------- |
| `page`      | int  | `1`     | Page number (1–500)  |

**Response:** Same paginated structure as trending.

#### `GET /api/v1/movies/top-rated`

| Query Param | Type | Default | Description          |
| ----------- | ---- | ------- | -------------------- |
| `page`      | int  | `1`     | Page number (1–500)  |

**Response:** Same paginated structure.

#### `GET /api/v1/movies/:tmdbId`

Returns full movie details including credits and videos.

| Path Param | Type | Description     |
| ---------- | ---- | --------------- |
| `tmdbId`   | int  | TMDB movie ID   |

**Response `200`**
```json
{
  "data": {
    "id": 550,
    "title": "Fight Club",
    "overview": "...",
    "runtime": 139,
    "genres": [{ "id": 18, "name": "Drama" }],
    "credits": {
      "cast": [{ "id": 1, "name": "...", "character": "...", "profile_path": "..." }],
      "crew": [{ "id": 2, "name": "...", "job": "Director" }]
    },
    "videos": {
      "results": [{ "key": "ytKey", "site": "YouTube", "type": "Trailer" }]
    }
  }
}
```

**Errors:** `404 NOT_FOUND`

#### `GET /api/v1/movies/:tmdbId/recommendations`

| Param   | Type | Description     |
| ------- | ---- | --------------- |
| `tmdbId`| int  | TMDB movie ID   |
| `page`  | int  | Page (query)    |

**Response:** Same paginated structure as trending.

---

### Search

#### `GET /api/v1/search/movies`

| Query Param     | Type    | Default | Description              |
| --------------- | ------- | ------- | ------------------------ |
| `q`             | string  | —       | **Required.** Search term|
| `page`          | int     | `1`     | Page number              |
| `year`          | int     | —       | Filter by release year   |
| `include_adult` | string  | `false` | `true` or `false`        |

**Response:** Same paginated structure.

---

### Watchlists

All watchlist endpoints require `Authorization: Bearer <token>`.

#### `GET /api/v1/watchlists`

List all watchlists for the authenticated user.

**Response `200`**
```json
{
  "data": [
    { "id": "uuid", "user_id": "uuid", "name": "Favorites", "created_at": "...", "updated_at": "..." }
  ]
}
```

#### `POST /api/v1/watchlists`

Create a new watchlist.

**Body**
```json
{ "name": "My Watchlist" }
```

**Response `201`**
```json
{
  "data": { "id": "uuid", "user_id": "uuid", "name": "My Watchlist", "created_at": "...", "updated_at": "..." }
}
```

#### `GET /api/v1/watchlists/:id`

Get a watchlist with its items (paginated).

| Query Param | Type | Default | Description        |
| ----------- | ---- | ------- | ------------------ |
| `page`      | int  | `1`     | Page number        |
| `limit`     | int  | `20`    | Items per page     |

**Response `200`**
```json
{
  "data": {
    "id": "uuid",
    "name": "Favorites",
    "items": [
      { "id": "uuid", "tmdb_movie_id": 550, "title": "Fight Club", "poster_path": "/…", "created_at": "..." }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 5, "total_pages": 1 }
  }
}
```

#### `PATCH /api/v1/watchlists/:id`

Update watchlist name.

**Body**
```json
{ "name": "Updated Name" }
```

**Response `200`** — Updated watchlist object.

#### `DELETE /api/v1/watchlists/:id`

Delete a watchlist and all its items.

**Response `204`** — No content.

#### `POST /api/v1/watchlists/:id/items`

Add a movie to a watchlist.

**Body**
```json
{
  "tmdb_movie_id": 550,
  "title": "Fight Club",
  "poster_path": "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg"
}
```

**Response `201`** — Created item object.

**Errors:** `409 CONFLICT` (movie already in watchlist)

#### `DELETE /api/v1/watchlists/:id/items/:itemId`

Remove a movie from a watchlist.

**Response `204`** — No content.

---

### News

#### `GET /api/v1/news`

Fetches movie-related news from NewsAPI.

| Query Param | Type   | Default                     | Description          |
| ----------- | ------ | --------------------------- | -------------------- |
| `q`         | string | `movies OR film OR cinema`  | Search query         |
| `page`      | int    | `1`                         | Page number          |
| `pageSize`  | int    | `20`                        | Articles per page    |
| `from`      | string | —                           | Start date (ISO)     |
| `to`        | string | —                           | End date (ISO)       |
| `language`  | string | `en`                        | Language code        |

**Response `200`**
```json
{
  "data": {
    "articles": [
      {
        "title": "Movie News Title",
        "url": "https://...",
        "source": "BBC",
        "publishedAt": "2026-02-09T10:00:00Z",
        "imageUrl": "https://...",
        "summary": "Brief description…"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "totalResults": 150,
      "totalPages": 8
    }
  }
}
```

---

## Error Format

All errors follow this consistent structure:

```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Validation failed",
    "details": [
      { "field": "name", "message": "Required" }
    ]
  }
}
```

### Error Codes

| HTTP | Code               | Meaning                              |
| ---- | ------------------ | ------------------------------------ |
| 400  | `BAD_REQUEST`      | Validation or input error            |
| 401  | `UNAUTHORIZED`     | Missing or invalid auth token        |
| 403  | `FORBIDDEN`        | Insufficient role/permissions        |
| 404  | `NOT_FOUND`        | Resource or endpoint not found       |
| 409  | `CONFLICT`         | Duplicate resource                   |
| 429  | `TOO_MANY_REQUESTS`| Rate limit exceeded                  |
| 500  | `INTERNAL_ERROR`   | Unexpected server error              |
| 502  | `BAD_GATEWAY`      | External service (TMDB/NewsAPI) down |
| 504  | `GATEWAY_TIMEOUT`  | External service timeout             |

---

## Caching Strategy

Redis is used to cache **external API responses** (GET endpoints only).

| Endpoint              | Cache TTL      |
| --------------------- | -------------- |
| Movie details         | 6 hours        |
| Trending              | 15 minutes     |
| Popular / Top Rated   | 30 minutes     |
| Recommendations       | 1 hour         |
| Search                | 5 minutes      |
| News                  | 30 minutes     |

- **Key format:** `cache:v1:<route>:<sha256(params)[0:16]>`
- **Disable caching:** Set `CACHE_ENABLED=false` in `.env`
- Watchlist data is **not cached** (always fresh from Supabase).

---

## Rate Limiting

| Scope           | Window    | Max Requests |
| --------------- | --------- | ------------ |
| Global          | 15 min    | 100          |
| Auth endpoints  | 15 min    | 20           |

Configurable via `RATE_LIMIT_WINDOW_MS` and `RATE_LIMIT_MAX` in `.env`.

Standard rate limit headers are included in responses:
- `RateLimit-Limit`
- `RateLimit-Remaining`
- `RateLimit-Reset`

---

## Security Notes

### Implemented Measures

1. **Helmet** — Sets security headers (X-Content-Type-Options, X-Frame-Options, etc.)
2. **CORS** — Only allows origins listed in `CORS_ORIGINS`
3. **JWT verification** — Supabase tokens are verified server-side via `supabase.auth.getUser()`
4. **Input validation** — All inputs are validated with Zod; unknown fields are stripped
5. **XSS protection** — User-provided strings are sanitized with `xss` library before storage
6. **API key protection** — TMDB/NewsAPI keys never appear in responses or client-accessible headers
7. **Secret redaction** — Logger redacts authorization headers, passwords, and API keys
8. **Request IDs** — Every request gets a correlation ID for tracing
9. **Graceful shutdown** — Handles SIGTERM/SIGINT cleanly

### CSRF

Since the backend uses **Bearer token authentication** (not cookies), CSRF attacks are mitigated by design. No authentication cookies are set.

---

## Frontend Integration Guide

### Base Configuration

```ts
// React example with Axios
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const API_BASE = 'http://localhost:4000/api/v1';

const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');

const api = axios.create({ baseURL: API_BASE });

// Attach JWT to every request automatically
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});
```

### Handling Auth Errors

```ts
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      // Token expired – Supabase SDK should auto-refresh
      // If still 401, redirect to login
      const { error } = await supabase.auth.refreshSession();
      if (error) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);
```

### Pagination Pattern

```ts
// Paginated list example
const { data } = await api.get('/movies/trending', {
  params: { page: 1, time_window: 'week' }
});

// data.data.results   → movie array
// data.data.page       → current page
// data.data.total_pages → for "Load More" / pagination UI
```

### Watchlist Operations

```ts
// Create watchlist
await api.post('/watchlists', { name: 'My Favorites' });

// Add movie
await api.post(`/watchlists/${watchlistId}/items`, {
  tmdb_movie_id: 550,
  title: 'Fight Club',
  poster_path: '/path.jpg'
});

// Get watchlist with items
const { data } = await api.get(`/watchlists/${watchlistId}`, {
  params: { page: 1, limit: 20 }
});
```

### Image URLs (TMDB)

TMDB returns relative poster/backdrop paths. Prepend the base URL:

```ts
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';
const posterUrl = `${TMDB_IMAGE_BASE}/w500${movie.poster_path}`;
const backdropUrl = `${TMDB_IMAGE_BASE}/original${movie.backdrop_path}`;
```

### Recommended Client-Side Caching

- Use **React Query** / **TanStack Query** for automatic client-side caching
- Set `staleTime` appropriately:
  - Movie details: 10–30 minutes
  - Trending/popular: 5 minutes
  - Search: 2 minutes
  - Watchlists: 0 (always fresh)

---

## Database Schema

### `profiles`

| Column       | Type        | Description                        |
| ------------ | ----------- | ---------------------------------- |
| `id`         | UUID (PK)   | Matches Supabase `auth.users.id`   |
| `email`      | TEXT        | User email                         |
| `role`       | TEXT        | `user` or `admin`                  |
| `created_at` | TIMESTAMPTZ | Auto-set                           |
| `updated_at` | TIMESTAMPTZ | Auto-updated via trigger           |

### `watchlists`

| Column       | Type        | Description              |
| ------------ | ----------- | ------------------------ |
| `id`         | UUID (PK)   | Auto-generated           |
| `user_id`    | UUID (FK)   | References `profiles.id` |
| `name`       | TEXT        | Watchlist name           |
| `created_at` | TIMESTAMPTZ | Auto-set                 |
| `updated_at` | TIMESTAMPTZ | Auto-updated             |

### `watchlist_items`

| Column          | Type        | Description                          |
| --------------- | ----------- | ------------------------------------ |
| `id`            | UUID (PK)   | Auto-generated                       |
| `watchlist_id`  | UUID (FK)   | References `watchlists.id`           |
| `tmdb_movie_id` | INTEGER     | TMDB movie ID                        |
| `title`         | TEXT        | Denormalized title (optional)        |
| `poster_path`   | TEXT        | Denormalized poster path (optional)  |
| `created_at`    | TIMESTAMPTZ | Auto-set                             |

**Unique constraint:** `(watchlist_id, tmdb_movie_id)` — prevents duplicates.

### Row Level Security (RLS)

All tables have RLS enabled. Users can only access their own data. See `db/migrations/001_initial_schema.sql` for full policies.

---

## Environment Variables Reference

| Variable                   | Required | Default                           | Description                    |
| -------------------------- | -------- | --------------------------------- | ------------------------------ |
| `PORT`                     | No       | `4000`                            | Server port                    |
| `NODE_ENV`                 | No       | `development`                     | Environment                    |
| `SUPABASE_URL`             | Yes      | —                                 | Supabase project URL           |
| `SUPABASE_SERVICE_ROLE_KEY`| Yes      | —                                 | Supabase service role key      |
| `TMDB_API_KEY`             | Yes      | —                                 | TMDB API key                   |
| `TMDB_ACCESS_TOKEN`        | Yes      | —                                 | TMDB read access token         |
| `TMDB_BASE_URL`            | No       | `https://api.themoviedb.org/3`    | TMDB base URL                  |
| `NEWS_API_KEY`             | Yes      | —                                 | NewsAPI key                    |
| `NEWS_API_BASE_URL`        | No       | `https://newsapi.org/v2`          | NewsAPI base URL               |
| `REDIS_URL`                | No       | `redis://localhost:6379`          | Redis connection string        |
| `CACHE_ENABLED`            | No       | `true`                            | Enable/disable Redis cache     |
| `CORS_ORIGINS`             | No       | `http://localhost:3000`           | Comma-separated allowed origins|
| `RATE_LIMIT_WINDOW_MS`     | No       | `900000`                          | Rate limit window (ms)         |
| `RATE_LIMIT_MAX`           | No       | `100`                             | Max requests per window        |
