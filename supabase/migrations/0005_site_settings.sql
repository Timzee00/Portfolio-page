-- Single-row settings table for everything the spec calls "Portfolio
-- Settings": hero background choice, typing roles, avatar, resume,
-- social links. The `id boolean primary key default true` trick with
-- a check constraint enforces exactly one row — there's only ever one
-- site, so a key-value table or multi-row design would be overkill.

create table site_settings (
  id boolean primary key default true,
  constraint single_row check (id),

  avatar_url text,
  resume_url text,

  hero_background_type text not null default 'grid' check (
    hero_background_type in ('grid', 'image', 'video')
  ),
  hero_background_url text,

  typing_roles text[] not null default array[
    'Frontend Developer', 'Graphics Designer', 'Creative Technologist'
  ],

  social_github text,
  social_linkedin text,
  social_instagram text,
  social_email text,

  updated_at timestamptz not null default now()
);

create trigger site_settings_set_updated_at before update on site_settings
  for each row execute function set_updated_at();

alter table site_settings enable row level security;

create policy "public reads site_settings" on site_settings
  for select using (true);

create policy "admin writes site_settings" on site_settings
  for insert with check (is_admin());

create policy "admin updates site_settings" on site_settings
  for update using (is_admin());

-- Seed the single row immediately so the app never has to handle a
-- "no settings row exists yet" case.
insert into site_settings (id) values (true);
