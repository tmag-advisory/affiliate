# TMAG Affiliate Dashboard

The Affiliate Dashboard is the React portal for TMAG affiliates. Affiliates can register or log in, view performance, create referral links, monitor commissions, request payouts, and access marketing resources that point prospects back to the client app.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- React Router 7
- TanStack Query
- Zustand
- Axios
- Framer Motion, Recharts, Lucide React

## Local URL

`bun run dev` starts the app on port `3010`:

```text
http://localhost:3010
```

## Setup

```bash
cd affiliate
bun install
```

Create a local `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_API_KEY=<same-value-as-backend-APP_API_KEY>
VITE_CLIENT_BASE_URL=http://localhost:3000
```

Do not commit `.env` files or real secrets.

## Scripts

| Command | Description |
| --- | --- |
| `bun run dev` | Start the development server on port `3010`. |
| `bun run build` | Run TypeScript project build and create the Vite production bundle. |
| `bun run lint` | Run ESLint. |
| `bun run preview` | Preview the production build locally. |

## Main route areas

- `/login`, `/register`, and `/forgot-password` affiliate auth.
- `/` affiliate overview dashboard.
- `/links` referral and campaign link generation.
- `/commissions` commission history and status.
- `/payouts` payout records and payout requests.
- `/resources` marketing materials and shareable referral URL.
- `/settings` affiliate profile and account settings.

## Project structure

```text
affiliate/
├── src/
│   ├── api/          # Axios client, hooks, and API types
│   ├── components/   # Affiliate chrome, guards, and UI primitives
│   ├── context/      # Auth context
│   ├── layouts/      # Auth and affiliate layouts
│   ├── lib/          # Access helpers, query client, chrome styles, and utilities
│   ├── pages/        # Affiliate and auth pages
│   ├── routes/       # React Router configuration
│   └── stores/       # Sidebar state
├── package.json
└── vite.config.ts
```

## API integration

- API base defaults to `http://localhost:8080/api/v1`.
- Requests send `X-Api-Key: VITE_API_KEY`.
- Auth stores the JWT in the `access_token` cookie and attaches it as `Authorization: Bearer <token>`.
- Affiliate APIs are backed primarily by `/api/v1/affiliate/*` and public tracking routes under `/api/v1/public/affiliate/*`.
- `VITE_CLIENT_BASE_URL` is used to build customer-facing links such as `http://localhost:3000/ref/<code>`.

## Development workflow

1. Start `spring-server` on port `8080` with affiliate endpoints and a matching `APP_API_KEY`.
2. Start `client/` on port `3000` if testing referral destinations.
3. Start this app with `bun run dev`.
4. Validate changes with `bun run build` and `bun run lint`.
