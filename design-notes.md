# Design notes

Tracking what's a real decision vs. a scaffold placeholder, so the next
phase (hero + design system) starts from an honest list instead of
guessing what's "already decided."

## Stage 2 decisions (hero + loading screen) — now real, not placeholder
- **Concept:** TIMZEE is both developer and designer — the hero proves
  this rather than stating it. Signature element: a cursor-tracked
  light that blends between a design-tool grid (magenta) and a
  code-editor dot grid (cyan) in `Hero.tsx`. Don't replace this with a
  generic particle/3D background — it's the one deliberate risk this
  page takes.
- **Palette:** near-black ink bg (`--background`), off-white chalk for
  light mode (not pure white), two accents used one-at-a-time —
  `--accent-design` (magenta) and `--accent-dev` (cyan) — never
  blended into a gradient. Defined in `globals.css`.
- **Type:** Bricolage Grotesque (display) + Instrument Sans (body) +
  JetBrains Mono (code-flavored details, and the "ZEE" half of the
  title). Chosen specifically to avoid the Inter/Space-Grotesk default
  pairing. See `lib/fonts.ts`.
- Title is deliberately split-styled: "TIM" in accent-design/display
  font, "ZEE" in accent-dev/mono font — a small typographic echo of
  the whole concept.

## Still placeholder — needs a design pass later
- Real project thumbnails/imagery (Stage 4) — nothing to design around
  yet since there's no content.
- Admin dashboard UI (Stage 7) — functional, not visual, priority.

## Stage 5 (blog) — decisions and one known gap
- Markdown rendered via `react-markdown` + `remark-gfm` (tables,
  strikethrough, task lists) — not `dangerouslySetInnerHTML`, avoids
  XSS from anything ever pasted into a post.
- View counts increment through a `security definer` Postgres function
  (`supabase/migrations/0002_view_counters.sql`) rather than a direct
  table update, since RLS only allows admins to UPDATE blog_posts/projects
  directly — a public page view isn't an admin action.
- Post body uses `prose dark:prose-invert` (Tailwind Typography) so it
  follows the active theme instead of assuming dark mode.

## Real decisions already made (keep these)
- Next.js App Router + SSR (not static export) — required because the
  admin dashboard needs live Supabase auth, not just public data.
- Netlify deploy via `@netlify/plugin-nextjs` — free tier, supports SSR.
- Lenis for smooth scroll, respects `prefers-reduced-motion`.
- Auth session refresh handled in `middleware.ts` — needed before any
  admin routes are built, easy to forget later.

## Stages 6–8 — decisions and simplifications
- Reviews are open to anonymous visitors by design (matches the spec's
  "users can rate/comment" — no forced signup). `approved` defaults to
  `true` so reviews show immediately; moderation in `/admin/reviews`
  is for removing bad-faith ones after the fact, not gatekeeping every
  submission. Reconsider the default if spam becomes a problem.
- Skills/achievements/testimonials/certificates admin pages are
  create-and-delete only, not full CRUD with editing — these are
  low-field, low-stakes records where "delete and re-add" is an
  acceptable workaround for now. Projects and blog posts got full
  edit pages because they're the content that actually matters most
  and changes incrementally rather than getting replaced wholesale.
- GitHub import always creates a **draft** — never auto-publishes —
  so an import can't accidentally put something incomplete on the
  live site.
- Command palette uses `ilike` (substring, case-insensitive), not
  Postgres full-text search (`tsvector`) or a fuzzy matcher. Good
  enough at this content scale; revisit if the catalog grows large
  enough that substring matching feels imprecise.

## Media upload — decisions
- One shared bucket (`portfolio-media`), folder-prefixed
  (`projects/`, `blog/`, `certificates/`) rather than five separate
  buckets — simpler policy management at this scale, and folders are
  cheap to add if content types diverge later.
- `MediaUpload.tsx` writes a hidden `<input>` so it works inside the
  existing native `<form action={serverAction}>` pattern — deliberately
  did NOT convert these forms to client-side-only submission just to
  support uploads, to avoid touching working create/update logic.
- Upload progress is binary (0 → 100), not a real byte-level progress
  bar — the Supabase JS client doesn't expose upload progress events
  on the standard `upload()` call. Good enough for a spinner; a real
  progress bar would need the resumable/TUS upload path instead.
- Deleting a file from the gallery UI also deletes it from Storage
  (not just detaches the URL) — avoids orphaned files accumulating
  in the bucket over time.

## Scheduled publishing (blog)
- A post with status "Published" and a future `published_at` stays
  hidden from `getPublishedBlogPosts`/`getBlogPostBySlug` (both filter
  `published_at <= now()`) until that time passes — no cron job or
  background worker needed, since it's just a query condition checked
  on every page load. Admin list shows "scheduled for <date>" instead
  of "published" for these so it's not mistaken for already-live.

## Gallery drag-reorder
- No schema change needed — `projects.gallery` is already a Postgres
  array, and array element order is preserved as stored, so
  "reordering the gallery" is purely a client-side concern: drag a
  thumbnail in `MediaUpload.tsx`, its position in the `urls` array
  changes, and that array (already synced to the hidden form input)
  is what gets saved. No sort_order column, no extra table.
- Uses native HTML5 drag-and-drop (`draggable`, `onDragStart`/`onDrop`)
  rather than a drag library — sufficient for reordering a handful of
  thumbnails, no need for the extra dependency at this scale.

## Portfolio Settings
- Single-row table (`id boolean primary key default true` + a check
  constraint) rather than a key-value table — there's exactly one
  site, so this is simpler than modeling arbitrary settings rows.
- Hero background defaults to the cursor-reactive grid (the original
  signature element from Stage 2) — an admin has to deliberately
  choose "image" or "video" to replace it, so nobody loses that design
  decision by accident just by visiting the settings page.
- Contact's social icons now only render for links that are actually
  set (`.filter(Boolean)` on href) — previously it always showed all
  four with placeholder hrefs, which would have quietly leaked example.com
  links to production.

## Full build-error sweep (post-deploy debugging)
Real issues found and fixed, beyond the three lint fixes already made:
- **Next.js version mismatch (the big one):** 4 dynamic route pages
  (`projects/[slug]`, `blog/[slug]`, admin `projects/[id]`, admin
  `blog/[id]`) were typed with `params: Promise<{...}>` and `await
  params` — that's the Next.js **15** convention. This project pins
  Next **14.2.5**, where `params` is a plain synchronous object. Fixed
  all 4 to match 14's actual contract. This would have failed Next's
  own route type-checking during `next build` regardless of any lint
  settings — worth knowing if any future page gets added by copying an
  example from Next 15 docs/tutorials, since the two conventions look
  almost identical and only diverge in this one spot.
- **`useSearchParams()` without `<Suspense>`:** Next 14 hard-fails the
  build for any component calling `useSearchParams()` that isn't
  wrapped in a Suspense boundary. `/admin/login` did this directly.
  Fixed by splitting into an outer `AdminLoginPage` (renders
  `<Suspense>`) and an inner `AdminLoginForm` (the actual hook call).
- Re-verified: every `noUncheckedIndexedAccess` risk pattern
  (destructuring, bracket indexing) across the whole codebase, every
  `catch` block's `unknown`-type handling, and every client-hook file
  actually has `"use client"`. All were already safe except the two
  already fixed in earlier debugging rounds.

## Mobile menu + theme toggle — real gaps, now fixed
- The hamburger button in `Navbar.tsx` had no `onClick` at all since
  the scaffold phase — it rendered but did nothing. Now opens an
  animated slide-down panel with the nav links; the icon itself
  animates hamburger → X. Background scroll is locked while open.
- There was no visible way to switch themes anywhere in the UI —
  `next-themes` was wired up correctly (system preference worked
  automatically), but nothing called `setTheme()`. Added
  `ThemeToggle.tsx` (sun/moon icon button) to both the desktop and
  mobile navbar layouts. It waits for client mount before rendering
  anything, to avoid a hydration mismatch (server can't know the
  visitor's OS theme preference).

## Media display gap (found and fixed)
- Real bug, not a design choice: the media upload admin UI (thumbnail,
  gallery, video, certificate images) was built and worked, but nothing
  on the *public* side ever rendered the results — `ProjectCard.tsx`,
  the project detail page, and `Certificates.tsx` never referenced
  `thumbnail_url`/`gallery`/`video_url`/`image_url` at all. Fixed all
  three. This also resolves "add graphics design work" — Design-category
  projects already worked structurally (no code-specific fields are
  required), the real blocker was that uploaded images had nowhere to
  display.

## GitHub import — real bug fixed
- `handleImport` in `GithubImportClient.tsx` had no `try/catch` around
  the import call — any failure (most commonly a slug collision, since
  `projects.slug` is unique) failed completely silently: no error
  shown, button just never changed to "Imported ✓". Fixed by having
  `importGithubRepoAsProject` return `{ error? }` instead of throwing,
  auto-deduping colliding slugs (`name`, `name-2`, `name-3`...) instead
  of failing outright, and surfacing any remaining error per-repo in
  the UI.

## AI assistant (Groq)
- One API route (`/api/ai`) builds a system prompt server-side from
  live Supabase data (site settings' typing roles, published project
  summaries, and — when a `projectSlug` is passed — that project's full
  detail) and forwards it to Groq's OpenAI-compatible chat completions
  endpoint. `GROQ_API_KEY` is server-only, read via `process.env` in
  `lib/ai/groq.ts`, never sent to the client.
- Non-streaming by design for now — a single request/response per
  message. Streaming would read better for longer answers but adds
  real complexity (SSE handling on both ends); flagging as a possible
  upgrade rather than building it speculatively.
- No rate limiting on `/api/ai` yet — since it costs API credits per
  call, this is worth adding (e.g. a simple per-IP or per-session cap)
  before the site gets meaningful traffic, not before.
- Model pinned to `llama-3.3-70b-versatile` in one place
  (`lib/ai/groq.ts`) — easy to swap if Groq deprecates it.

## About section — now editable
- Added `about_heading` + `about_timeline` (jsonb) to `site_settings`
  (migration 0006). `About.tsx` split into a server wrapper (fetches
  settings) + `AboutClient.tsx` (the actual animated timeline,
  unchanged visually, now prop-driven instead of hardcoded).
- Admin form represents the timeline as a `Label|Title|Body`
  per-line textarea rather than a dynamic add/remove field UI —
  simpler to build and to paste into from a phone; any line that
  doesn't match the format is silently skipped rather than erroring,
  since a malformed line shouldn't block saving the rest.

## AI reads real GitHub content now
- When a project has a `github_url`, `/api/ai` fetches that repo's
  actual README and language breakdown from GitHub's public API and
  includes them in the system prompt — not just the DB summary. All
  three github.ts fetch helpers (`fetchRepoReadme`,
  `fetchRepoLanguages`) are best-effort and never throw; a private
  repo, missing README, or rate limit just means less context, not a
  broken chat.
- README content is capped at 4000 characters in the prompt to bound
  token usage — long READMEs get truncated, not summarized first
  (summarizing would need an extra AI call before the real one).
- This reads the single project currently in view, not the visitor's
  general questions — asking about a project by name without being on
  its page won't trigger a repo fetch. Worth knowing as a real
  limitation, not a bug: matching a project by name from free text
  reliably is a harder problem than context deliberately scoped here.

## AI knowledge base field
- `site_settings.ai_knowledge_base` — free text, included verbatim in
  the system prompt when non-empty. Deliberately unstructured (no
  schema/validation) so anything can be pasted in — bios, other AI
  conversations' summaries, career facts — without needing to match a
  specific format.
