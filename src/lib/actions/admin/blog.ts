"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { estimateReadingMinutes } from "@/lib/reading-time";

const csv = (v: FormDataEntryValue | null) =>
  String(v ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const PostSchema = z.object({
  slug: z.string().trim().min(1).regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  title: z.string().trim().min(1),
  excerpt: z.string().trim().min(1),
  content_markdown: z.string().trim().min(1),
  cover_image_url: z.string().trim().url().optional().or(z.literal("")),
  status: z.enum(["draft", "published"]),
});

function parseFormData(formData: FormData) {
  return PostSchema.parse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    content_markdown: formData.get("content_markdown"),
    cover_image_url: formData.get("cover_image_url"),
    status: formData.get("status"),
  });
}

export async function createBlogPost(formData: FormData) {
  const parsed = parseFormData(formData);
  const supabase = await createClient();

  const scheduledInput = String(formData.get("published_at") ?? "").trim();
  const published_at =
    parsed.status === "published"
      ? scheduledInput
        ? new Date(scheduledInput).toISOString()
        : new Date().toISOString()
      : null;

  const { error } = await supabase.from("blog_posts").insert({
    ...parsed,
    cover_image_url: parsed.cover_image_url || null,
    tags: csv(formData.get("tags")),
    reading_time_minutes: estimateReadingMinutes(parsed.content_markdown),
    published_at,
  });

  if (error) {
    console.error("createBlogPost:", error.message);
    throw new Error(error.message);
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function updateBlogPost(postId: string, formData: FormData) {
  const parsed = parseFormData(formData);
  const supabase = await createClient();

  // Only stamp published_at the first time a post goes to "published" —
  // fetch current state to avoid resetting the original publish date
  // on every subsequent edit. An explicit scheduled date always wins.
  const { data: existing } = await supabase
    .from("blog_posts")
    .select("status, published_at")
    .eq("id", postId)
    .maybeSingle();

  const scheduledInput = String(formData.get("published_at") ?? "").trim();
  const published_at =
    parsed.status === "published"
      ? scheduledInput
        ? new Date(scheduledInput).toISOString()
        : existing?.published_at ?? new Date().toISOString()
      : null;

  const { error } = await supabase
    .from("blog_posts")
    .update({
      ...parsed,
      cover_image_url: parsed.cover_image_url || null,
      tags: csv(formData.get("tags")),
      reading_time_minutes: estimateReadingMinutes(parsed.content_markdown),
      published_at,
    })
    .eq("id", postId);

  if (error) {
    console.error("updateBlogPost:", error.message);
    throw new Error(error.message);
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${parsed.slug}`);
  redirect("/admin/blog");
}

export async function deleteBlogPost(postId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", postId);
  if (error) console.error("deleteBlogPost:", error.message);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}
