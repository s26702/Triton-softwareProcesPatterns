<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# Triton — Agent Guide

## What Is This Project?

**Triton Event Portal** — a role-based event management app where **Volunteers** and **Organizers** sign up, log in, and are routed to role-specific dashboards. Built with Next.js 16, React 19, Supabase, TypeScript, and Tailwind CSS 4.

## Tech Stack

| Layer       | Technology                         | Version  |
|-------------|------------------------------------|----------|
| Framework   | Next.js (App Router)               | 16.4.4   |
| UI          | React                              | 19.3.0   |
| Language    | TypeScript                         | 5.x      |
| Styling     | Tailwind CSS + plain CSS modules   | 4.x      |
| Backend/DB  | Supabase (Auth + Postgres)         | ^2.118.0 |
| Testing     | Vitest + React Testing Library     | ^5.1.0   |
| Bundler     | Turbopack (via `next dev`)         | built-in |

## Project Structure

```
Triton/
├── AGENTS.md                          # ← You are here
├── package.json
├── tsconfig.json                      # Path alias: @/* → ./src/*
├── next.config.ts                     # Turbopack + Tailwind CSS loader
├── vitest.config.ts                   # Vitest + jsdom + @/* path alias config
├── .env.local                         # NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
│
└── src/
    ├── __tests__/
    │   ├── setup.ts                   # Imports @testing-library/jest-dom/vitest
    │   ├── authService.test.ts        # Unit tests for AuthService
    │   ├── supabaseAuthRepo.test.ts   # Unit tests for SupabaseAuthRepository
    │   ├── LoginForm.test.tsx         # Component tests for LoginForm
    │   └── RoleGuard.test.tsx         # Component tests for RoleGuard
    │
    ├── app/
    │   ├── globals.css                # Tailwind import + CSS custom properties
    │   ├── layout.tsx                 # Root layout (Geist fonts, LayoutProps<"/">)
    │   ├── page.tsx                   # Root "/" → redirect('/login')
    │   │
    │   ├── login/
    │   │   ├── page.tsx               # Renders <LoginForm />
    │   │   └── login.css              # Plain CSS for login/sign-up page
    │   │
    │   ├── organizer-dashboard/
    │   │   └── page.tsx               # Protected by <RoleGuard allowedRole="organizer">
    │   │
    │   └── volunteer-dashboard/
    │       └── page.tsx               # Protected by <RoleGuard allowedRole="volunteer">
    │
    ├── components/
    │   ├── LoginForm.tsx              # Client component — login & sign-up form (toggleable)
    │   └── RoleGuard.tsx              # Client component — role-based route protection
    │
    ├── lib/
    │   └── supabaseClient.ts          # Supabase browser client singleton
    │
    ├── repositories/
    │   └── supabaseAuthRepo.ts        # Supabase implementation of IAuthRepository
    │
    └── services/
        └── authService.ts             # AuthService class, IAuthRepository interface, types
```

## Architecture

The codebase follows a **clean architecture** pattern with three layers:

```
UI (components/) → Service (services/) → Repository (repositories/)
```

### Service Layer — `src/services/authService.ts`

Defines all auth types and the core business logic. **Start here** to understand the domain model.

- **Types:** `UserRole` (`'volunteer' | 'organizer'`), `UserProfile` (`{ id, email, role }`)
- **Interface:** `IAuthRepository` — contract for any auth backend
  - `signIn(email, password) → UserProfile`
  - `signUp(email, password, role) → UserProfile`
  - `getCurrentUser() → UserProfile | null`
  - `signOut() → void`
- **Class:** `AuthService` — business logic that consumes any `IAuthRepository`
  - `login()` — validates input, calls `signIn`, returns profile + redirect URL
  - `register()` — validates input + password confirmation, calls `signUp`, returns profile + redirect URL
  - `authorize(allowedRole)` — checks current session, returns authorization result + redirect
  - `logout()` — delegates to repository

### Repository Layer — `src/repositories/supabaseAuthRepo.ts`

Implements `IAuthRepository` using Supabase. Accepts an optional `SupabaseClient` for testing.

- `signUp()` → `supabase.auth.signUp()` then inserts into `profiles` table
- `signIn()` → `supabase.auth.signInWithPassword()` then queries `profiles` table
- `getCurrentUser()` → `supabase.auth.getSession()` then queries `profiles` table
- `signOut()` → `supabase.auth.signOut()`

### Component Layer — `src/components/`

| Component     | Type   | Purpose |
|---------------|--------|---------|
| `LoginForm`   | Client | Dual-mode form (login / sign-up) with role selector. Toggles via internal state. |
| `RoleGuard`   | Client | Wraps dashboard pages. Checks auth + role, redirects if unauthorized. Uses render-prop pattern: `children(profile, handleLogout)`. |

## Supabase Schema

The app expects a `profiles` table in Supabase:

| Column  | Type   | Notes                                    |
|---------|--------|------------------------------------------|
| `id`    | uuid   | Primary key, matches Supabase auth user ID |
| `email` | text   | User's email address                     |
| `role`  | text   | `'volunteer'` or `'organizer'`           |

**RLS Note:** Ensure Row Level Security policies allow:
- Authenticated users to `INSERT` their own profile row (for sign-up)
- Authenticated users to `SELECT` their own profile row (for login/session check)

## Route Map

| Route                    | Auth Required | Role Required | Behavior                          |
|--------------------------|:---:|:---:|-------------------------------------------------------|
| `/`                      | No  | —   | Server-side redirect → `/login`                       |
| `/login`                 | No  | —   | Login + Sign-up form                                  |
| `/organizer-dashboard`   | Yes | `organizer`  | Protected dashboard; unauthorized → redirect   |
| `/volunteer-dashboard`   | Yes | `volunteer`  | Protected dashboard; unauthorized → redirect   |

## Styling Conventions

- **Dashboard pages** use **Tailwind CSS** utility classes directly in JSX.
- **Login page** uses **plain CSS** in `src/app/login/login.css` (class-name-based).
- Global styles and Tailwind config are in `src/app/globals.css`.
- Fonts: Geist Sans + Geist Mono loaded via `next/font/google` in the root layout.

## Key Patterns & Conventions

1. **`'use client'` directive** — All interactive components (`LoginForm`, `RoleGuard`, dashboard pages) are client components.
2. **`useMemo` for services** — `AuthService` is instantiated inside `useMemo` to avoid re-creation on re-renders.
3. **Path alias** — Use `@/` to import from `src/` (configured in `tsconfig.json`).
4. **Next.js 16 specifics** — The root layout uses `LayoutProps<"/">` (a Next.js 16 type). Consult `node_modules/next/dist/docs/` for API changes.

## Environment Variables

| Variable                          | Required | Description              |
|-----------------------------------|:---:|-----------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL`        | Yes | Supabase project URL               |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`   | Yes | Supabase anonymous/public API key   |

These are defined in `.env.local` (not committed to version control).

## Common Tasks

### Adding a new protected route

1. Create `src/app/<route-name>/page.tsx` as a `'use client'` component.
2. Wrap content with `<RoleGuard allowedRole="volunteer|organizer">`.
3. Use the render-prop `children(profile, handleLogout)` to access the user profile.

### Adding a new auth method to the service

1. Add the method signature to `IAuthRepository` in `src/services/authService.ts`.
2. Add business logic to `AuthService` in the same file.
3. Implement the Supabase-specific logic in `src/repositories/supabaseAuthRepo.ts`.
4. Add corresponding unit tests in `src/__tests__/authService.test.ts` and `src/__tests__/supabaseAuthRepo.test.ts`.

### Testing

Tests live in `src/__tests__/` and run with **Vitest** (`jsdom` environment) and **React Testing Library**:

- **Service tests (`authService.test.ts`)**: Pass a mocked `IAuthRepository` into `new AuthService(mockRepo)`.
- **Repository tests (`supabaseAuthRepo.test.ts`)**: Mock `@/lib/supabaseClient` (to avoid `createClient` throwing when env vars are unset) and pass a mocked `SupabaseClient` into `new SupabaseAuthRepository(mockClient)`.
- **Component tests (`LoginForm.test.tsx`, `RoleGuard.test.tsx`)**: Mock `next/navigation` (`useRouter`) and `@/repositories/supabaseAuthRepo`.

### Running the app & tests

```bash
npm run dev       # Start dev server (Turbopack)
npm run build     # Production build
npm run start     # Start production server
npm test          # Run Vitest in interactive watch mode
npm run test:run  # Run all tests once
npm run lint      # Run ESLint
```
