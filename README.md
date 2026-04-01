# Social Network 1.0

A minimal social network where users sign up, create a profile, post status updates, and browse a feed of posts from all users.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript (strict), Tailwind CSS, shadcn/ui
- **Backend:** Next.js API routes with Zod validation
- **Database & Auth:** Supabase (Postgres + Auth + Row Level Security)
- **Deployment:** Vercel
- **Testing:** Vitest + React Testing Library

## Features

| Feature | Description |
|---------|-------------|
| **Authentication** | Email/password signup and login via Supabase Auth. Middleware protects all `/feed` and `/profile` routes. Profile auto-created on signup via database trigger. |
| **Posts + Feed** | Create status updates (max 500 chars), view a chronological feed of all posts with author info, delete your own posts. |
| **User Profiles** | Display name, bio, join date. View any user's profile and their posts. Edit your own profile. |
| **Likes** | Toggle likes on posts with optimistic UI updates and like counts. |

## Architecture

```
Client Component --> API Route --> Supabase Server Client --> Postgres (RLS enforced)
Server Component --> Supabase Server Client --> Postgres (RLS enforced)
```

### Auth Flow
1. User signs up/logs in via Supabase Auth
2. `middleware.ts` intercepts `/(protected)/*` — redirects to `/login` if no session
3. Server components read session via `supabase-server.ts`
4. API routes verify JWT via Supabase server client
5. Profile auto-created on signup via database trigger

### API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/posts` | Fetch all posts with author profile, newest first |
| POST | `/api/posts` | Create a new post (authenticated, Zod validated) |
| DELETE | `/api/posts/[id]` | Delete own post (RLS enforced) |
| GET | `/api/profile/[id]` | Fetch a user's profile + their posts |
| PUT | `/api/profile` | Update own profile (display name, bio) |
| POST | `/api/posts/[id]/like` | Toggle like on a post |

All API routes return a `{ data, error }` envelope.

### Database Schema

Three tables with Row Level Security:
- **profiles** — public read, self insert/update
- **posts** — public read, self insert/delete, 500 char max
- **likes** — public read, self insert/delete, unique per user+post

## Getting Started

### Prerequisites
- Node.js 20+
- A Supabase project with the schema applied (see `plan.md` for full SQL)

### Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run lint` | Run ESLint |

## Testing

27 unit tests covering:
- Post content validation (empty, max length, type checking)
- Profile update validation (display name, bio limits)
- API response envelope shape
- PostFeed component rendering (empty state, posts, author names, delete visibility)
- `cn()` utility (class merging, conditionals, Tailwind dedup)

```bash
npm run test:run
```

## Project Structure

```
app/
  (auth)/           Login, signup pages + auth layout
  (protected)/      Feed, profile pages (requires auth)
  api/
    posts/          GET, POST, DELETE + like toggle
    profile/        GET by id, PUT own profile
components/
  layout/           Navbar, LogoutButton
  posts/            PostForm, PostCard, PostFeed
  ui/               shadcn components
lib/
  types.ts          All TypeScript types
  supabase.ts       Browser client
  supabase-server.ts Server client with cookies
middleware.ts       Auth protection for /(protected) routes
```
