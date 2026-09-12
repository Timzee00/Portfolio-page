"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { estimateReadingMinutes } from "@/lib/reading-time";

const csv = (v: FormDataEntryValue | null) => String(v ?? "").split(",").map((s) => s.trim()).filter(Boolean);
const optionalUrl = z.string().trim().url().optional().or(z.literal(""));

const PostSchema = z.object({
  slug: z.string().trim().min(1).regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  title: z.string().trim().min(1),
  excerpt: z.string().trim().min(1),
  content_markdown: z.string().trim().min(1),
  cover_image_url: optionalUrl,
  status: z.enum(["draft", "published"]),
  before_media_type: z.enum(["image", "video"]).nullable(),
  after_media_type: z.enum(["image", "video"]).nullable(),
  before_media_url: optionalUrl,
  after_media_url: optionalUrl,
  before_project_url: optionalUrl,
  after_project_url: optionalUrl,
});

function parseFormData(formData: FormData) {
  const media = (name: string) => String(formData.get(name) ?? "").trim();
  const enabled = formData.get("before_after") === "true";
  return PostSchema.parse({
    slug: formData.get("slug"), title: formData.get("title"), excerpt: formData.get("excerpt"),
    content_markdown: formData.get("content_markdown"), cover_image_url: formData.get("cover_image_url"), status: formData.get("status"),
    before_media_type: enabled ? media("before_media_type") : null,
    after_media_type: enabled ? media("after_media_type") : null,
    before_media_url: enabled ? (media("before_media_link") || media("before_media_url")) : "",
    after_media_url: enabled ? (media("after_media_link") || media("after_media_url")) : "",
    before_project_url: enabled ? media("before_project_url") : "",
    after_project_url: enabled ? media("after_project_url") : "",
  });
}

function comparisonValues(parsed: z.infer<typeof PostSchema>) {
  return {
    before_after: Boolean(parsed.before_media_url || parsed.after_media_url || parsed.before_project_url || parsed.after_project_url),
    before_media_type: parsed.before_media_type,
    before_media_url: parsed.before_media_url || null,
    before_project_url: parsed.before_project_url || null,
    after_media_type: parsed.after_media_type,
    after_media_url: parsed.after_media_url || null,
    after_project_url: parsed.after_project_url || null,
  };
}

function publishDate(status: "draft" | "published", input: string, existing?: string | null) {
  if (status !== "published") return null;
  return input ? new Date(input).toISOString() : existing ?? new Date().toISOString();
}

export async function createBlogPost(formData: FormData) {
  const parsed = parseFormData(formData); const supabase = await createClient();
  const published_at = publishDate(parsed.status, String(formData.get("published_at") ?? "").trim());
  const { error } = await supabase.from("blog_posts").insert({ ...parsed, ...comparisonValues(parsed), cover_image_url: parsed.cover_image_url || null, tags: csv(formData.get("tags")), reading_time_minutes: estimateReadingMinutes(parsed.content_markdown), published_at });
  if (error) { console.error("createBlogPost:", error.message); throw new Error(error.message); }
  revalidatePath("/admin/blog"); revalidatePath("/blog"); redirect("/admin/blog");
}

export async function updateBlogPost(postId: string, formData: FormData) {
  const parsed = parseFormData(formData); const supabase = await createClient();
  const { data: existing } = await supabase.from("blog_posts").select("published_at").eq("id", postId).maybeSingle();
  const published_at = publishDate(parsed.status, String(formData.get("published_at") ?? "").trim(), existing?.published_at);
  const { error } = await supabase.from("blog_posts").update({ ...parsed, ...comparisonValues(parsed), cover_image_url: parsed.cover_image_url || null, tags: csv(formData.get("tags")), reading_time_minutes: estimateReadingMinutes(parsed.content_markdown), published_at }).eq("id", postId);
  if (error) { console.error("updateBlogPost:", error.message); throw new Error(error.message); }
  revalidatePath("/admin/blog"); revalidatePath("/blog"); revalidatePath(`/blog/${parsed.slug}`); redirect("/admin/blog");
}

export async function deleteBlogPost(postId: string) {
  const supabase = await createClient(); const { error } = await supabase.from("blog_posts").delete().eq("id", postId);
  if (error) console.error("deleteBlogPost:", error.message);
  revalidatePath("/admin/blog"); revalidatePath("/blog");
}
