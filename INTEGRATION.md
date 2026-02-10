# FlixStream — Full-Stack Integration Guide

## Architecture Overview

```
┌─────────────────────┐     HTTP/JSON      ┌──────────────────┐
│   Next.js Frontend  │  ◀──────────────▶  │  Express Backend  │
│   (port 3000)       │                    │  (port 4000)      │
│                     │                    │                   │
│  Supabase Auth SDK  │                    │  TMDB Service     │
│  Axios API Client   │                    │  NewsAPI Service  │
│  React Context      │                    │  Redis Cache      │
└─────────────────────┘                    └──────────────────┘
         │                                          │
         │  Auth (JWT)                              │
         ▼                                          ▼
┌─────────────────────┐                ┌──────────────────┐
│  Supabase Auth      │                │  Supabase DB     │
│  (hosted)           │                │  (Postgres + RLS)│
└─────────────────────┘                └──────────────────┘
```

## Quick Start

### Prerequisites
- Node.js 18+
- Docker Desktop (for Redis)
- Git

### 1. Start Redis
```bash
cd Backend
docker compose up -d
```

### 2. Start Backend
```bash
cd Backend
cp .env.example .env   # Fill in your keys
npm install
npm run dev
```
Backend runs on `http://localhost:4000`. Health check: `GET /api/v1/health`

### 3. Start Frontend
```bash
cd Frontend
cp .env.example .env.local   # Fill in your keys
npm install                   # or pnpm install
npm run dev
```
Frontend runs on `http://localhost:3000`.

---

## Environment Variables

### Backend (`Backend/.env`)
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 4000) |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `TMDB_API_KEY` | TMDB v3 API key |
| `TMDB_ACCESS_TOKEN` | TMDB v4 Bearer token |
| `NEWS_API_KEY` | NewsAPI.org key |
| `REDIS_URL` | Redis connection URL |
| `CORS_ORIGINS` | Comma-separated allowed origins |

### Frontend (`Frontend/.env.local`)
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API URL (e.g., `http://localhost:4000/api/v1`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase **anon** key (safe for browser) |
| `NEXT_PUBLIC_TMDB_IMAGE_BASE` | TMDB image CDN base (default: `https://image.tmdb.org/t/p`) |

---

## Frontend Architecture

### Key Files

| File | Purpose |
|------|---------|
| `lib/supabase.ts` | Supabase client initialized with anon key |
| `lib/api.ts` | Axios instance + all API call functions |
| `lib/tmdb.ts` | TMDB image URL helpers, genre mapping, formatting utils |
| `context/auth-context.tsx` | React context for auth state (signIn, signUp, signOut, OAuth) |

### API Client (`lib/api.ts`)

The API client automatically:
1. Attaches Supabase JWT to every request via interceptor
2. Normalizes error responses
3. Exports typed functions for every backend endpoint

```typescript
import { fetchTrending, fetchMovieDetail, searchMovies } from '@/lib/api'

// Get trending movies
const { results } = await fetchTrending('day')

// Get movie details with credits & videos
const movie = await fetchMovieDetail(550) // Fight Club

// Search
const { results, total_results } = await searchMovies('Inception')
```

### Authentication Flow

1. **Sign Up / Sign In**: `LoginPage` → `useAuth().signIn()` → Supabase Auth
2. **Session**: Supabase SDK stores JWT in localStorage, auto-refreshes
3. **API Calls**: Axios interceptor reads session token, sends as `Authorization: Bearer <jwt>`
4. **Backend**: `requireAuth` middleware verifies JWT via `supabase.auth.getUser()`
5. **Protected Pages**: Watchlist/My List check `useAuth().user` and redirect to login if null

### Data Flow: TMDB Movies

```
Frontend Page → lib/api.ts → Backend /api/v1/movies/* → tmdb.service.ts → TMDB API
                                                       ↓
                                                  Redis Cache
```

The TMDB response shape is used throughout:
```typescript
interface TmdbMovie {
  id: number            // TMDB numeric ID
  title: string
  overview: string
  poster_path: string   // e.g., "/abc123.jpg"
  backdrop_path: string
  release_date: string  // "2024-05-15"
  vote_average: number  // 0-10
  genre_ids: number[]
  // ...
}
```

Images are resolved via `lib/tmdb.ts`:
```typescript
import { posterUrl, backdropUrl } from '@/lib/tmdb'

posterUrl('/abc123.jpg')      // → "https://image.tmdb.org/t/p/w500/abc123.jpg"
backdropUrl('/xyz789.jpg')    // → "https://image.tmdb.org/t/p/w1280/xyz789.jpg"
```

---

## Backend API Endpoints

See [BACKEND_API.md](Backend/BACKEND_API.md) for full documentation.

### Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/health` | No | Health check |
| GET | `/api/v1/auth/me` | Yes | Current user profile |
| GET | `/api/v1/movies/trending` | No | Trending movies |
| GET | `/api/v1/movies/popular` | No | Popular movies |
| GET | `/api/v1/movies/top-rated` | No | Top rated movies |
| GET | `/api/v1/movies/:id` | No | Movie detail with credits/videos |
| GET | `/api/v1/movies/:id/recommendations` | No | Recommended movies |
| GET | `/api/v1/search/movies` | No | Search movies by query |
| GET | `/api/v1/news` | No | Entertainment news |
| GET | `/api/v1/watchlists` | Yes | User's watchlists |
| POST | `/api/v1/watchlists` | Yes | Create watchlist |
| GET | `/api/v1/watchlists/:id/items` | Yes | Watchlist items |
| POST | `/api/v1/watchlists/:id/items` | Yes | Add item to watchlist |
| DELETE | `/api/v1/watchlists/:wid/items/:iid` | Yes | Remove item |

---

## Page → API Mapping

| Frontend Page | API Calls |
|---------------|-----------|
| `/` (Home) | `fetchTrending()`, `fetchPopular()`, `fetchTopRated()` |
| `/movie/[id]` | `fetchMovieDetail(id)`, `fetchRecommendations(id)` |
| `/search` | `searchMovies(query)` |
| `/watchlist` | `fetchWatchlists()`, `fetchWatchlistItems(id)`, `removeFromWatchlist()` |
| `/my-list` | Same as watchlist (shared backend) |
| `/news` | `fetchNews()` |
| `/login` | Supabase Auth (`signIn`, `signUp`, `signInWithOAuth`) |

---

## Common Issues & Troubleshooting

### CORS errors
Make sure `CORS_ORIGINS` in `Backend/.env` includes `http://localhost:3000`.

### "Missing Supabase environment variables"
Make sure `Frontend/.env.local` has both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` set.

### Images not loading
- Check `next.config.mjs` has `image.tmdb.org` in `remotePatterns`
- Ensure `NEXT_PUBLIC_TMDB_IMAGE_BASE` is set correctly

### Watchlist shows "Sign in" message
User must be authenticated. Sign in at `/login` first.

### Backend returns 502 "TMDB service unavailable"
- Verify `TMDB_ACCESS_TOKEN` in `Backend/.env`
- Check if TMDB API is reachable from your network

---

## Database Schema

See `Backend/db/migrations/001_initial_schema.sql` for full schema.

**Tables:**
- `profiles` — User profiles (synced from Supabase Auth)
- `watchlists` — Named watchlists per user
- `watchlist_items` — Movies saved to watchlists (TMDB ID + metadata)
- `view_history` — User viewing history

All tables use **Row Level Security (RLS)** — users can only access their own data.
