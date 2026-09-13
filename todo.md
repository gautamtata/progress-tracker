# progress-tracker — todo

Live at **https://progress.gautamtata.com**. Repo at `~/Documents/progress-tracker`.

## Stack snapshot

- Next.js 16 (App Router, Turbopack) + TypeScript
- Bun for install/dev/build
- Prisma 7 (`prisma db push` to sync schema; uses `PrismaPg` adapter, config in `prisma.config.ts`)
- Prisma Postgres (Vercel-linked) + Vercel Blob (Vercel-linked)
- shadcn/ui (base-ui flavor — no `asChild`, use `buttonVariants()` on `<Link>`)
- Auth: single `APP_PASSWORD` env var, cookie-based, gated by `src/proxy.ts`
- Fonts: Fraunces (display, italic) + DM Sans (body) + JetBrains Mono (data)
- Aesthetic: "athletic journal" — espresso bg, cream text, saffron accent, grain + radial gradient mesh

## Done

- [x] Scaffold Next.js + Bun + Tailwind + shadcn
- [x] Prisma schema (`Entry { takenAt, weight, unit, notes, frontUrl, backUrl, leftSideUrl, rightSideUrl }`)
- [x] Password gate via `proxy.ts` (Next 16 renamed middleware → proxy)
- [x] Pages: `/login`, `/` (dashboard), `/new`, `/entry/[id]`
- [x] API: `/api/auth`, `/api/upload` (Vercel Blob), `/api/entries`, `/api/entries/[id]` (DELETE cleans Blob)
- [x] Photo capture: `<input type="file" capture="environment">` for native camera on phone
- [x] Weight area chart (Recharts via shadcn) with saffron gradient fill
- [x] Per-pose Archive: 4 carousels (Front / Back / Left side / Right side), oldest → newest
- [x] Date + time + weight overlays on every photo, photos link to entry detail
- [x] Entry detail page with photo carousel, pull-quote notes, two-tap delete
- [x] Timestamps: stored UTC `TIMESTAMPTZ`, rendered in `America/Los_Angeles`
- [x] Vercel deploy + custom domain `progress.gautamtata.com` (had to PATCH project to set `framework: "nextjs"` — created empty in dashboard meant auto-detect never ran)

## To do (v2 — when you're ready)

- [ ] **Progress reel** — pick a pose + date range → auto-generate slideshow/video. Easiest: client `<canvas>` crossfade. Stretch: `ffmpeg.wasm` for downloadable MP4.
- [ ] **Edit entry** — currently can only delete + recreate. Add edit page reusing `NewEntryForm`.
- [ ] **PWA install** — add manifest + icons so "Add to Home Screen" gives a real app icon and standalone display.
- [ ] **Measurements beyond weight** — body fat %, waist, arms, etc. Schema migration + new chart per metric (or stacked).
- [ ] **Export** — download all photos + CSV of weights as a zip backup.
- [ ] **Photo privacy upgrade** — currently Blob URLs are public-but-unguessable. Switch to server-proxied images via `/api/photo/[id]?pose=front` so even leaked URLs require the auth cookie.
- [ ] **Compare view** — side-by-side: pick two dates, see all 4 poses overlaid or paired.
- [ ] **Local backup** — script/route to mirror the DB + Blob to local disk on demand (since you wanted the option of keeping things off-cloud eventually).

## Operational notes

- Schema changes: edit `prisma/schema.prisma` → `bunx prisma db push` (no migrations folder; using direct push for personal DB).
- Env vars on Vercel (already set): `APP_PASSWORD`, `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `POSTGRES_URL`, `PRISMA_DATABASE_URL`. Auto-injected by integrations except `APP_PASSWORD`.
- Local: `bun dev` → http://localhost:3000. Phone over LAN: http://192.168.1.85:3000.
- Deploy: `vercel deploy --prod --yes`. If a fresh build deploys 0ms with no output, the project's `framework` got reset — repatch via API.
- Pacific Time is hardcoded in `src/lib/time.ts` (`TZ = "America/Los_Angeles"`).

## Known quirks

- Vercel Blob URLs are public (anyone with the URL can view). Acceptable for personal use; see "Photo privacy upgrade" above for the fix.
- Vercel Deployment Protection is **off** for this project so the password gate is the only auth layer.
- Side photos: "Left side" / "Right side" in the schema means the side of *your body* you're showing the camera (whichever convention you adopted on day 1 — stay consistent).
