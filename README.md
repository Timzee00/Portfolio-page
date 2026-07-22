# TIMZEE Portfolio

Next.js 14 (App Router) + TypeScript + Tailwind + Supabase, deployed to
Netlify on the free tier. All 8 roadmap stages are built — see "What's
built" below for the honest breakdown of what's real vs. simplified.

## Why SSR, not static export

The admin dashboard needs live Supabase auth, so this uses standard
Next.js SSR (not `output: 'export'`), deployed via Netlify's official
`@netlify/plugin-nextjs` — still free, just not a static site.
`netlify.toml` is already configured for this.

## Local setup

```bash
npm install
cp .env.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

## Supabase setup

1. Create a free project at supabase.com.
2. Copy the Project URL and anon key into `.env.local`.
3. Run the schema and seed data, **in order**:
   ```bash
   supabase db push   # applies everything in supabase/migrations/
   psql "$DATABASE_URL" -f supabase/seed.sql
   ```
   No CLI? Paste each file into the Supabase SQL editor in this exact
   order: `0001_init.sql` → `0002_view_counters.sql` →
   `0003_review_helpful.sql` → `0004_storage.sql` → `seed.sql`.
   `0004_storage.sql` creates the `portfolio-media` bucket used by every
   upload field in the admin (project thumbnails/galleries/demo videos,
   blog covers, certificate images/PDFs) — skip it and those uploads
   will fail with a "bucket not found" error.
4. Sign up once through Supabase Auth to get a user UUID (or use the
   dashboard's Authentication tab), then make yourself an admin:
   ```sql
   insert into admins (user_id) values ('<your-user-uuid>');
   ```
   Without this row every write is blocked by RLS, and `/admin/*`
   routes will redirect you straight back to the login page.
5. Sign in at `/admin/login` with that account's email/password.

## Deploying to Netlify

1. Push this repo to GitHub.
2. Netlify → **Add new site → Import from Git**. Build settings come
   from `netlify.toml` — the Next.js plugin should auto-detect.
3. Add the same env vars from `.env.local` under **Site settings →
   Environment variables**, plus `NEXT_PUBLIC_SITE_URL` set to your
   real deployed URL (used by the sitemap and metadata).

## What's built (all 8 stages)

1. **Scaffold** — Next.js/TS/Tailwind, Supabase client/server/middleware
2. **Hero + loading screen** — cursor-reactive dual-canvas signature
   element, split-styled title, typing role line (see `design-notes.md`
   for the concept rationale)
3. **Supabase schema** — every table from the spec, full RLS via an
   `admins` table + `is_admin()` function, atomic view/helpful counters
   via `security definer` functions (migrations 0002, 0003)
4. **Public core sections** — About (timeline), Skills (interactive
   hover badges), Projects (filterable grid + individual pages),
   Contact (Server Action → `messages` table)
5. **Blog** — `/blog` + `/blog/[slug]`, tag filter, search, load-more
   pagination, markdown rendering (react-markdown + remark-gfm),
   reading time, atomic view counter, related posts
6. **Reviews & testimonials** — portfolio-wide + per-project reviews
   (star rating, sort by newest/highest/helpful, helpful voting),
   admin-curated testimonials, all writable by visitors without an
   account (RLS lets anyone insert, only the author/admin can edit)
7. **Admin dashboard** — `/admin/login` + auth-gated `/admin/*` (guarded
   twice: `middleware.ts` and `requireAdmin()` per page). Full CRUD for
   projects and blog posts (list/new/edit/delete), with real drag-drop
   media upload (Supabase Storage, not pasted URLs) for project
   thumbnails/galleries/demo videos, blog covers, and certificate
   images/PDFs. Simpler create-and-delete flows for skills,
   achievements, testimonials, certificates (no edit page for these
   yet — delete and re-add is the workaround, see `design-notes.md`);
   messages inbox (read/unread, delete); reviews moderation
   (approve/unapprove, delete)
8. **Extras** — GitHub repo import (`/admin/github`, imports as a draft
   project for review), global Cmd/Ctrl+K command palette
   (`/api/search` across projects/posts/skills), animated achievement
   counters, public certificates grid, `sitemap.xml` + `robots.txt`,
   JSON-LD structured data (Person on every page, BlogPosting on posts)

## Known simplifications (real, not hidden)

- Skills/achievements/testimonials/certificates: create + delete only,
  no edit-in-place yet.
- GitHub import uses the unauthenticated public API (60 req/hr limit)
  — fine for occasional admin use; add a `GITHUB_TOKEN` header in
  `lib/github.ts` if that becomes limiting.
- Command palette search is `ilike` substring matching, not full-text
  search or fuzzy matching — accurate for exact-ish queries, won't
  handle typos.
- Nothing in this project has been run against a live Supabase instance
  or built with `npm install` — there's no network access in the
  environment this was built in. Read through `supabase/migrations/`
  before trusting it blindly in production, and expect to fix at least
  a few small issues on first real run.

## Folder structure

```
src/
  app/
    admin/
      login/                # outside the auth guard
      (protected)/           # everything else — guarded by requireAdmin()
    api/search/              # command palette backend
    blog/, projects/[slug]/  # public routes
  components/
    admin/, blog/, hero/, layout/, providers/, reviews/, sections/
  lib/
    actions/                 # Server Actions (contact, reviews, admin/*)
    supabase/                 # client, server, queries, admin-guard
    github.ts, reading-time.ts, fonts.ts, utils.ts
  middleware.ts               # session refresh + /admin gate
supabase/
  migrations/                 # 0001 schema, 0002/0003 counter functions
  seed.sql
```

## Media upload

Every image/video/PDF field in the admin (`ProjectForm`, `BlogPostForm`,
Certificates) is a real drag-drop upload (`components/admin/MediaUpload.tsx`)
backed by the `portfolio-media` Supabase Storage bucket — not a paste-a-URL
text field. Files upload straight to Storage from the browser and the
resulting public URL is what actually gets saved to the database.

Not yet built: a resume/avatar upload in a "Portfolio Settings" admin
page — there's no settings table yet for site-wide fields like that
(hero background choice, typing role list, social links). Natural
next addition, flagged here rather than left silently missing.

## Portfolio Settings

`/admin/settings` controls everything that used to be hardcoded in the
components: hero background (default cursor-reactive grid, or swap in
a custom image/looping video), the typing-role list, profile photo,
resume PDF, and social/contact links. All backed by a single-row
`site_settings` table (`0005_site_settings.sql`) — the homepage reads
it fresh on every request via `getSiteSettings()`, so changes go live
immediately without a rebuild.
