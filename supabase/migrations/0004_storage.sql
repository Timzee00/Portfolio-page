-- Storage bucket for all uploaded media (project thumbnails/galleries,
-- blog covers, certificates, resume, avatar). One bucket, folder-based
-- organization (projects/, blog/, certificates/, resume/, avatar/) —
-- simpler to manage than five separate buckets for this scale of site.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-media',
  'portfolio-media',
  true, -- public read via the CDN URL, no signed URLs needed
  52428800, -- 50MB — enough for short demo videos, not a general file host
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'application/pdf']
)
on conflict (id) do nothing;

-- storage.objects has RLS on by default in Supabase. Public read works
-- through the public bucket flag for the /object/public/ URL — this
-- policy additionally covers authenticated reads (e.g. the admin
-- dashboard listing files) and keeps behavior explicit either way.
create policy "public reads portfolio-media" on storage.objects
  for select using (bucket_id = 'portfolio-media');

create policy "admin uploads to portfolio-media" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'portfolio-media' and public.is_admin());

create policy "admin updates portfolio-media" on storage.objects
  for update to authenticated
  using (bucket_id = 'portfolio-media' and public.is_admin());

create policy "admin deletes portfolio-media" on storage.objects
  for delete to authenticated
  using (bucket_id = 'portfolio-media' and public.is_admin());
