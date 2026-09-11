-- Public blog comments + server-side abuse controls for open visitor actions.

create table blog_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references blog_posts (id) on delete cascade,
  user_id uuid references auth.users (id) on delete set null,
  author_name text not null check (char_length(trim(author_name)) between 1 and 120),
  comment text not null check (char_length(trim(comment)) between 1 and 2000),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create index blog_comments_post_approved_created_idx
  on blog_comments (post_id, created_at desc)
  where approved = true;

create index blog_comments_created_idx
  on blog_comments (created_at desc);

alter table blog_comments enable row level security;

create policy "public read approved blog comments"
  on blog_comments for select
  using (approved or is_admin() or user_id = auth.uid());

create policy "anyone can submit a blog comment"
  on blog_comments for insert
  with check (true);

create policy "admin manages blog comments"
  on blog_comments for update
  using (is_admin())
  with check (is_admin());

create policy "owner or admin deletes blog comment"
  on blog_comments for delete
  using (user_id = auth.uid() or is_admin());

-- Small server-side fixed-window limiter. Keys are opaque and never exposed
-- to public clients. Advisory locking prevents concurrent requests from
-- racing a missing row into duplicate inserts.
create table public_action_rate_limits (
  key text primary key,
  window_started_at timestamptz not null default now(),
  hits integer not null default 0 check (hits >= 0),
  updated_at timestamptz not null default now()
);

alter table public_action_rate_limits enable row level security;

create or replace function consume_public_action_rate_limit(
  p_key text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_hits integer;
  started_at timestamptz;
begin
  if p_key is null or length(p_key) = 0 or length(p_key) > 300 then
    return false;
  end if;

  if p_limit < 1 or p_window_seconds < 1 then
    return false;
  end if;

  perform pg_advisory_xact_lock(hashtext(p_key));

  select hits, window_started_at
    into current_hits, started_at
  from public_action_rate_limits
  where key = p_key
  for update;

  if not found then
    insert into public_action_rate_limits (key, window_started_at, hits, updated_at)
    values (p_key, now(), 1, now());
    return true;
  end if;

  if started_at <= now() - make_interval(secs => p_window_seconds) then
    update public_action_rate_limits
      set window_started_at = now(), hits = 1, updated_at = now()
    where key = p_key;
    return true;
  end if;

  if current_hits >= p_limit then
    return false;
  end if;

  update public_action_rate_limits
    set hits = hits + 1, updated_at = now()
  where key = p_key;

  return true;
end;
$$;

grant execute on function consume_public_action_rate_limit(text, integer, integer)
to anon, authenticated;

-- Keep the limiter table completely inaccessible through normal table RLS.
revoke all on public_action_rate_limits from anon, authenticated;
