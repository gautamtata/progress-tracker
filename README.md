# progress-tracker

Personal fitness progress tracker. Next.js 16 + Prisma 7 (Postgres) + Vercel Blob, password-gated.

## Setup

1. Copy `.env.example` → `.env.local` and fill in:
   - `APP_PASSWORD` — single password that gates the whole app
   - `DATABASE_URL` — Prisma Postgres connection string (from Vercel)
   - `BLOB_READ_WRITE_TOKEN` — Vercel Blob token (from Vercel)

   When deployed to Vercel with the linked Postgres + Blob integrations, `DATABASE_URL` and `BLOB_READ_WRITE_TOKEN` are injected automatically. You only need to set `APP_PASSWORD` manually.

2. Install + push schema:
   ```bash
   bun install
   bunx prisma generate
   bunx prisma db push
   ```

3. Run:
   ```bash
   bun dev
   ```

## Routes

- `/login` — password gate
- `/` — dashboard (weight chart + entry list)
- `/new` — new entry (weight, date, optional front/back/side photos, notes)
- `/entry/[id]` — entry detail with photo carousel + delete

## Notes

- All timestamps stored UTC, rendered in `America/Los_Angeles`.
- Photos go to Vercel Blob; URLs are public but unguessable. If you want stricter privacy later, switch to a server-proxied image route.
- Auth is a single password kept in a cookie — no users table.
