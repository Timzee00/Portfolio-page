import { createClient } from "@/lib/supabase/client";

const BUCKET = "portfolio-media";

export type UploadProgress = (percent: number) => void;

/**
 * Uploads a file to the shared portfolio-media bucket under the given
 * folder (e.g. "projects", "blog", "certificates", "resume", "avatar")
 * and returns its public URL. Supabase's JS client doesn't expose
 * granular upload progress for standard uploads, so `onProgress` is
 * called with 0 then 100 rather than a true byte-level percentage —
 * good enough to drive a spinner, not a real progress bar.
 */
export async function uploadMedia(
  file: File,
  folder: string,
  onProgress?: UploadProgress
): Promise<string> {
  const supabase = createClient();

  const ext = file.name.includes(".") ? file.name.split(".").pop() : "";
  const path = `${folder}/${crypto.randomUUID()}${ext ? `.${ext}` : ""}`;

  onProgress?.(0);
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  onProgress?.(100);

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/** Extracts the storage path from a public URL, for deletion. */
export function pathFromPublicUrl(url: string): string | null {
  const marker = `/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
}

export async function deleteMedia(url: string): Promise<void> {
  const path = pathFromPublicUrl(url);
  if (!path) return;
  const supabase = createClient();
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) console.error("deleteMedia:", error.message);
}
