# USIC Sheffield Website

Official site for the Islamic Circle at the University of Sheffield (USIC): events, membership, resources, community blog, and an admin console.

Live site: [usicsheffield.com](https://usicsheffield.com)

## Features

**Public**
- Homepage: hero slideshow, events, membership
- Pages: about, events (list + detail + signup), blog/forum, resources, membership, sponsors, FAQ, fundraising, pricing
- Google sign-in, member profile (`/my-profile`), restricted-account handling

**Admin**
- Google admin login and dashboard (`/admin-dashboard`)
- Users, event CRUD + signups, post moderation (approve/reject), analytics
- AI-assisted event parsing (Gemini)
- Image uploads for events and profile photos (Cloudinary)

**Security**
- Firebase ID token auth; admin gated on `admins/{uid}`
- CSRF tokens, input validation/sanitization, security headers + CSP
- Rate limiting on API and image routes (in-process; best-effort on multi-instance deploys)

## Tech stack

| Layer | Choice |
| --- | --- |
| App | Next.js 16 (App Router), React 19, TypeScript |
| UI | Tailwind CSS 4, Lucide, Radix icons, Swiper |
| Auth / data | Firebase Auth, Firestore, Firebase Admin SDK |
| Media | Cloudinary (`next-cloudinary`) |
| AI | Google Gemini (`@google/generative-ai`) |
| Validation | Zod, isomorphic-dompurify |
| Ops | ESLint, Turbopack (`next dev`), Vercel Speed Insights |

Request pipeline: `src/proxy.ts` (CSP, CSRF cookie, rate limits). There is no `middleware.ts`.

Deeper navigation: [docs/CODEBASE_MAP.md](docs/CODEBASE_MAP.md). Firestore rules source: [firestore.rules](firestore.rules).

## Getting started

**Prerequisites:** Bun 1.3+, Node.js 18+ (for Next.js), a Firebase project (Auth with Google, Firestore), Cloudinary, and a Gemini key if you use AI event parse. `bun run test:rules` uses the local `firebase-tools` CLI (installed via `bun install`) to run the Firestore emulator.

```bash
git clone https://github.com/usicwebsite/usicsheffield.git
cd usicsheffield
bun install
cp env.example .env.local
# fill .env.local (see below)
bun run dev
```

App: [http://localhost:3000](http://localhost:3000)

### Environment variables

Canonical list and comments: **[env.example](env.example)**. Copy to `.env.local` locally, and set the same keys in your host (Vercel: Project → Settings → Environment Variables).

Required groups:

| Group | Purpose |
| --- | --- |
| `NEXT_PUBLIC_FIREBASE_*` | Client Firebase |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Admin SDK (JSON string). Optional alt: `GOOGLE_APPLICATION_CREDENTIALS` path |
| `JWT_SECRET` | Server crypto/signing |
| `CLOUDINARY_*` | Profile and event image uploads |
| `GEMINI_API_KEY` | Admin event AI parse |

Optional: `RATE_LIMIT_*` knobs (defaults in `env.example`).

If production shows `Firebase: Error (auth/invalid-api-key)`, the `NEXT_PUBLIC_FIREBASE_*` vars are missing or wrong on the host.

Do not commit `.env.local` or service account JSON.

## Project structure

```
src/
├── app/                     # App Router
│   ├── api/                 # Route handlers
│   │   ├── admin/           # Admin APIs (events, posts, users, …)
│   │   ├── auth/            # Login
│   │   ├── events/          # Public events + signup
│   │   ├── posts/           # Forum posts
│   │   ├── upload-event-image/
│   │   └── upload-profile-photo/
│   ├── about/, blog/, events/, faq/, fundraising/
│   ├── membership/, pricing/, resources/, sponsors/
│   ├── login/, my-profile/, restricted/
│   ├── admin-login/, admin/, admin-dashboard/
│   ├── layout.tsx, page.tsx, globals.css
│   └── …
├── components/              # UI (incl. components/admin/)
├── contexts/                # FirebaseProvider, etc.
├── hooks/
├── lib/                     # firebase*, auth-api, csrf, rateLimit, *-data
└── proxy.ts                 # CSP, CSRF cookie, rate limits (Next proxy)
docs/
└── CODEBASE_MAP.md
firestore.rules              # Deployed Firestore security rules
env.example
pages-documentation/         # Page/content notes for editors
public/                      # Static assets
```

## Scripts

| Command | What it does |
| --- | --- |
| `bun run dev` | Dev server with Turbopack |
| `bun run build` | Production build |
| `bun run start` | Serve production build |
| `bun run lint` | ESLint |
| `bun run lint:oxlint` | Oxlint (incl. anti-slop rules) |
| `bun run test:rules` | Firestore rules tests via local Firebase emulator (`firebase-tools`) |

## Deployment

**Vercel (typical)**
1. Connect `usicwebsite/usicsheffield`
2. Set env vars from `env.example`
3. Deploy on push to the production branch

**Firebase Hosting** (if used instead of or with a static export setup)
1. `bun run build`
2. Firebase CLI: init hosting if needed, then `firebase deploy`

After rule changes, deploy Firestore rules from `firestore.rules` via Firebase Console or CLI (Next does not apply them automatically).

## Security notes

- Public APIs and pages use Firebase ID tokens where auth is required; admin routes use `withAdminAuth` (token + `admins/{uid}`).
- Restricted users are blocked via custom claims and/or `users/{uid}.restricted` (see `src/lib/firebase-admin-utils.ts`).
- Rate limits in `src/proxy.ts` are in-memory per instance.
- Keep CSP and sanitization in mind when rendering user HTML.

## Contributing

1. Branch from the default branch
2. Keep changes scoped; prefer existing patterns in `src/lib` and `src/app/api`
3. Open a PR with what changed and how you verified it

## License

MIT. See [LICENSE](LICENSE) if present.

## Support

- Email: islam.circle@sheffield.ac.uk
- Website: [usicsheffield.com](https://usicsheffield.com)

## Acknowledgments

University of Sheffield, sponsors, the USIC community, and contributors to this codebase.
