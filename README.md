# Vance & Co. — Salon Management Portal

A frontend-only Software Requirements Specification (SRS) implementation for
**Advanced Frontend Web Technology (2501CS401)**, built with React, Redux
Toolkit, React Router, React Hook Form, MUI, and Recharts.

This is a **frontend presentation layer** exactly as scoped in the SRS: there
is no live backend. A mock API layer (`src/api/mockApi.js`) simulates network
requests (with delay, success/error states, and in-memory persistence) so
every Redux thunk, loading state, and form is written exactly as it would be
against a real server. Swapping in a real backend later only touches
`src/api/axiosClient.js` and the thunks that import from `mockApi`.

## Getting started

You'll need Node.js 18+ and an internet connection (to download packages —
this project was authored in a sandboxed environment with no network access,
so dependencies have **not** been installed or build-tested here; do that on
your own machine before submitting).

```bash
npm install
npm run dev       # starts the Vite dev server, usually at http://localhost:5173
npm run build      # production build, output in dist/
npm run preview    # preview the production build locally
```

## Demo accounts

Every seeded account uses the password `password123`.

| Role          | Email                  |
|---------------|------------------------|
| Customer      | customer@salon.test    |
| Barber        | barber@salon.test      |
| Receptionist  | reception@salon.test   |
| Administrator | admin@salon.test       |

You can also register a brand-new Customer account from the login screen.

## Architecture

```
src/
├── api/            mock backend + axios wiring point for a real one later
├── store/          Redux Toolkit store + one slice per domain
├── routes/         route protection guard + the full route table
├── layouts/        AuthLayout (login/register) and DashboardLayout (app shell)
├── components/     shared building blocks (status badges, stat cards, dialogs…)
├── pages/
│   ├── auth/           login, register
│   ├── customer/       dashboard, catalog, booking wizard, store, cart, appointments, profile
│   ├── barber/          dashboard, availability, earnings
│   ├── receptionist/    master schedule, customer lookup
│   └── admin/           overview, staff, pricing, inventory, wages, analytics
├── theme.js         MUI theme (palette, type scale)
└── index.css        base styles + the barber-pole accent stripe
```

## Design system

- **Palette:** deep pine green (`#1f3a2e`) + warm brass (`#b98b33`) — an
  upscale barbershop/salon identity rather than a default SaaS blue.
- **Type:** Fraunces (display serif, headings), Inter (UI/body), IBM Plex Mono
  (prices, times, and other tabular data).
- **Signature element:** a thin repeating diagonal stripe (clay red / ivory /
  pine), a nod to the classic barber pole, used once as a top accent on the
  app chrome rather than scattered throughout.

## Known limitations (by design, for a course project)

- Data resets on every full page reload except for: your logged-in session,
  any account you register, and staff availability/commission edits — all of
  which are persisted to `localStorage`. Appointments, services, inventory,
  and cart contents are seeded fresh from `mockDb.js` each session.
- "Analytics" and "wage" figures are computed from the in-memory appointment
  data only; there is no real payment processor or persistent database.
- This codebase has **not** been `npm install`-ed or build-tested in this
  environment (no network access here) — please run it locally before your
  demo/submission and fix any dependency-version hiccups that come up.

## Deploying (Week 12 of the SRS plan)

1. Push this project to a GitHub repository.
2. Import the repository in [Vercel](https://vercel.com/new).
3. Framework preset: **Vite**. Build command `npm run build`, output
   directory `dist` (Vercel usually detects these automatically).
4. Deploy — no environment variables are required for the mock-data build.
