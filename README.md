# Neon Portfolio

A dark-mode, neon-accented portfolio site with a private "host mode" that lets
only you edit content directly on the live site — no separate admin dashboard,
no public sign-up.

## Stack & why

| Piece | Choice | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | Server components fetch DB data directly; API routes double as your backend; deploys anywhere. |
| Styling | Tailwind CSS | Fast to theme, and the whole design token system lives in `tailwind.config.js`. |
| Database | SQLite via Prisma | Zero setup locally (`prisma/dev.db` is just a file). Swap to Postgres for production by changing one line — see below. |
| Auth | NextAuth (Credentials provider) | There is no user table and no sign-up flow. The only account that can exist is the one defined by `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH` in your `.env`. |

## Design

Dark charcoal-navy background (`#0B0E14`, not pure black) with two neon accents
used sparingly — cyan for primary actions/links, violet for secondary
highlights — plus a faint animated grid backdrop and a signature "scan-in"
underline under the hero tagline. Headings use Space Grotesk, body text uses
Inter, and labels/tags use JetBrains Mono for a subtle terminal feel that ties
into the neon-dev aesthetic without leaning on green-on-black clichés.

All of this lives in `tailwind.config.js` and `app/globals.css` — change the
`cyan` / `violet` hex values there to retheme the whole site.

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Set up your environment file
cp .env.example .env

# 3. Generate a bcrypt hash for your host password
npm run hash-password
# copy the printed ADMIN_PASSWORD_HASH into .env
# also set ADMIN_EMAIL to whatever email you want to log in with
# and generate NEXTAUTH_SECRET with: openssl rand -base64 32

# 4. Create the database and seed placeholder content
npm run db:push
npm run db:seed

# 5. Run it
npm run dev
```

Visit `http://localhost:3000`. Click **Host login** in the top right and sign
in with the email/password you set in `.env` to enter edit mode — you'll see
"+ Add" buttons and Edit/Delete controls appear on every section.

## Editing content

Everything editable (intro, projects, education, experience, skills,
recommendations) is stored in the database, not hardcoded in components, so
changes you make while logged in as host persist immediately and are visible
to every visitor.

If you'd rather browse/edit the raw data directly, run:

```bash
npm run db:studio
```

This opens Prisma Studio, a GUI for your database, at `http://localhost:5555`.

## Deploying

**Recommended: Vercel**

1. Push this project to a GitHub repo.
2. Import it into Vercel.
3. Because SQLite's file-based database doesn't persist on serverless
   deployments, switch to a hosted Postgres database for production:
   - Provision one (e.g. Vercel Postgres, Neon, Supabase — all have free tiers).
   - In `prisma/schema.prisma`, change `provider = "sqlite"` to
     `provider = "postgresql"`.
   - Set `DATABASE_URL` in Vercel's environment variables to your Postgres
     connection string.
4. Add `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `NEXTAUTH_SECRET`, and
   `NEXTAUTH_URL` (your production URL) as environment variables in Vercel.
5. Deploy. Vercel runs `prisma generate` automatically via the `postinstall`
   script; run `npx prisma db push` once (locally, pointed at the production
   `DATABASE_URL`, or via a Vercel deploy hook) to create the tables, then
   seed if you want starter content.

## Project structure

```
app/
  api/            # REST-style routes: GET is public, POST/PUT/DELETE require host session
  page.js         # main page — server component, fetches all data via Prisma
  layout.js       # fonts + global providers
components/       # one component per section, each owns its own CRUD UI
lib/
  auth.js         # NextAuth config (single admin user from env vars)
  prisma.js       # Prisma client singleton
  requireHost.js  # guard used at the top of every mutating API route
prisma/
  schema.prisma   # all data models
  seed.js         # placeholder content
```

## Security notes

- There is no registration endpoint anywhere — the only credentials that will
  ever work are the ones you set in `.env`.
- Passwords are never stored in plaintext; only the bcrypt hash lives in
  `.env`, and `.env` is git-ignored.
- Every mutating API route (`POST`/`PUT`/`DELETE`) checks the server-side
  session via `requireHost()` before touching the database, regardless of
  what the client sends.
