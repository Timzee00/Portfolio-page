-- TIMZEE portfolio — initial schema
-- Run via: supabase db push  (or paste into the SQL editor)

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────
-- Admins — who can write. Add yourself after creating your
-- Supabase auth user: insert into admins (user_id) values ('<your-uuid>');
-- ─────────────────────────────────────────────────────────
create table admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

create function is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$;

-- Reusable "keep updated_at current" trigger
create function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─────────────────────────────────────────────────────────
-- Categories
-- ─────────────────────────────────────────────────────────
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────
-- Projects
-- ─────────────────────────────────────────────────────────
create table projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  description text,
  category text not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  tech_stack text[] not null default '{}',
  github_url text,
  live_url text,
  thumbnail_url text,
  gallery text[] not null default '{}',
  video_url text,
  features text[] not null default '{}',
  challenges text,
  solutions text,
  lessons_learned text,
  roadmap text,
  views int not null default 0,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger projects_set_updated_at before update on projects
  for each row execute function set_updated_at();
create index projects_status_idx on projects (status);
create index projects_category_idx on projects (category);

-- ─────────────────────────────────────────────────────────
-- Blog posts
-- ─────────────────────────────────────────────────────────
create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  content_markdown text not null,
  cover_image_url text,
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published')),
  reading_time_minutes int,
  views int not null default 0,
  likes int not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger blog_posts_set_updated_at before update on blog_posts
  for each row execute function set_updated_at();
create index blog_posts_status_idx on blog_posts (status);

-- ─────────────────────────────────────────────────────────
-- Skills
-- ─────────────────────────────────────────────────────────
create table skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  description text,
  years_experience numeric,
  related_project_slugs text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────
-- Achievements (animated counters)
-- ─────────────────────────────────────────────────────────
create table achievements (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value int not null,
  suffix text default '',
  sort_order int not null default 0
);

-- ─────────────────────────────────────────────────────────
-- Certificates
-- ─────────────────────────────────────────────────────────
create table certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text,
  image_url text,
  file_url text,
  issued_at date,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────
-- Testimonials (admin-curated, distinct from open reviews)
-- ─────────────────────────────────────────────────────────
create table testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_role text,
  author_company text,
  quote text not null,
  avatar_url text,
  pinned boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────
-- Portfolio-wide reviews (open, visitor-submitted)
-- ─────────────────────────────────────────────────────────
create table portfolio_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  author_name text not null,
  rating int not null check (rating between 1 and 5),
  comment text,
  helpful_count int not null default 0,
  approved boolean not null default true,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────
-- Per-project reviews
-- ─────────────────────────────────────────────────────────
create table project_reviews (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  author_name text not null,
  rating int not null check (rating between 1 and 5),
  comment text,
  helpful_count int not null default 0,
  approved boolean not null default true,
  created_at timestamptz not null default now()
);
create index project_reviews_project_idx on project_reviews (project_id);

-- ─────────────────────────────────────────────────────────
-- Contact messages
-- ─────────────────────────────────────────────────────────
create table messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────
alter table admins enable row level security;
alter table categories enable row level security;
alter table projects enable row level security;
alter table blog_posts enable row level security;
alter table skills enable row level security;
alter table achievements enable row level security;
alter table certificates enable row level security;
alter table testimonials enable row level security;
alter table portfolio_reviews enable row level security;
alter table project_reviews enable row level security;
alter table messages enable row level security;

-- admins: only admins can read the admin list; no public access at all
create policy "admins manage admins" on admins
  for all using (is_admin()) with check (is_admin());

-- categories, skills, achievements, certificates, testimonials:
-- public read, admin write
create policy "public read categories" on categories for select using (true);
create policy "admin write categories" on categories for insert with check (is_admin());
create policy "admin update categories" on categories for update using (is_admin());
create policy "admin delete categories" on categories for delete using (is_admin());

create policy "public read skills" on skills for select using (true);
create policy "admin write skills" on skills for insert with check (is_admin());
create policy "admin update skills" on skills for update using (is_admin());
create policy "admin delete skills" on skills for delete using (is_admin());

create policy "public read achievements" on achievements for select using (true);
create policy "admin write achievements" on achievements for insert with check (is_admin());
create policy "admin update achievements" on achievements for update using (is_admin());
create policy "admin delete achievements" on achievements for delete using (is_admin());

create policy "public read certificates" on certificates for select using (true);
create policy "admin write certificates" on certificates for insert with check (is_admin());
create policy "admin update certificates" on certificates for update using (is_admin());
create policy "admin delete certificates" on certificates for delete using (is_admin());

create policy "public read testimonials" on testimonials for select using (true);
create policy "admin write testimonials" on testimonials for insert with check (is_admin());
create policy "admin update testimonials" on testimonials for update using (is_admin());
create policy "admin delete testimonials" on testimonials for delete using (is_admin());

-- projects & blog_posts: public sees only published, admin sees/writes everything
create policy "public read published projects" on projects
  for select using (status = 'published' or is_admin());
create policy "admin write projects" on projects for insert with check (is_admin());
create policy "admin update projects" on projects for update using (is_admin());
create policy "admin delete projects" on projects for delete using (is_admin());

create policy "public read published blog posts" on blog_posts
  for select using (status = 'published' or is_admin());
create policy "admin write blog posts" on blog_posts for insert with check (is_admin());
create policy "admin update blog posts" on blog_posts for update using (is_admin());
create policy "admin delete blog posts" on blog_posts for delete using (is_admin());

-- portfolio_reviews: anyone can submit, only the author or an admin can
-- edit/delete their own review, only approved reviews are publicly visible
create policy "public read approved portfolio reviews" on portfolio_reviews
  for select using (approved or is_admin() or user_id = auth.uid());
create policy "anyone can submit a portfolio review" on portfolio_reviews
  for insert with check (true);
create policy "owner or admin updates portfolio review" on portfolio_reviews
  for update using (user_id = auth.uid() or is_admin());
create policy "owner or admin deletes portfolio review" on portfolio_reviews
  for delete using (user_id = auth.uid() or is_admin());

-- project_reviews: same pattern
create policy "public read approved project reviews" on project_reviews
  for select using (approved or is_admin() or user_id = auth.uid());
create policy "anyone can submit a project review" on project_reviews
  for insert with check (true);
create policy "owner or admin updates project review" on project_reviews
  for update using (user_id = auth.uid() or is_admin());
create policy "owner or admin deletes project review" on project_reviews
  for delete using (user_id = auth.uid() or is_admin());

-- messages: anyone can submit a contact message, only admin can read/manage them
create policy "anyone can send a message" on messages
  for insert with check (true);
create policy "admin reads messages" on messages
  for select using (is_admin());
create policy "admin updates messages" on messages
  for update using (is_admin());
create policy "admin deletes messages" on messages
  for delete using (is_admin());
