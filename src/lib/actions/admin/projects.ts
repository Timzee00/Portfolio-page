"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const csv = (v: FormDataEntryValue | null) =>
  String(v ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const ProjectSchema = z.object({
  slug: z.string().trim().min(1).regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only"),
  title: z.string().trim().min(1),
  summary: z.string().trim().min(1),
  description: z.string().trim().optional(),
  category: z.string().trim().min(1),
  status: z.enum(["draft", "published", "archived"]),
  github_url: z.string().trim().url().optional().or(z.literal("")),
  live_url: z.string().trim().url().optional().or(z.literal("")),
  thumbnail_url: z.string().trim().url().optional().or(z.literal("")),
  challenges: z.string().trim().optional(),
  solutions: z.string().trim().optional(),
  lessons_learned: z.string().trim().optional(),
});

function parseFormData(formData: FormData) {
  return ProjectSchema.parse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    summary: formData.get("summary"),
    description: formData.get("description"),
    category: formData.get("category"),
    status: formData.get("status"),
    github_url: formData.get("github_url"),
    live_url: formData.get("live_url"),
    thumbnail_url: formData.get("thumbnail_url"),
    challenges: formData.get("challenges"),
    solutions: formData.get("solutions"),
    lessons_learned: formData.get("lessons_learned"),
  });
}

export async function createProject(formData: FormData) {
  const parsed = parseFormData(formData);
  const supabase = await createClient();

  const { error } = await supabase.from("projects").insert({
    ...parsed,
    github_url: parsed.github_url || null,
    live_url: parsed.live_url || null,
    thumbnail_url: parsed.thumbnail_url || null,
    tech_stack: csv(formData.get("tech_stack")),
    features: csv(formData.get("features")),
    gallery: csv(formData.get("gallery")),
    video_url: String(formData.get("video_url") ?? "") || null,
  });

  if (error) {
    console.error("createProject:", error.message);
    throw new Error(error.message);
  }

  revalidatePath("/admin/projects");
  revalidatePath("/");
  redirect("/admin/projects");
}

export async function updateProject(projectId: string, formData: FormData) {
  const parsed = parseFormData(formData);
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .update({
      ...parsed,
      github_url: parsed.github_url || null,
      live_url: parsed.live_url || null,
      thumbnail_url: parsed.thumbnail_url || null,
      tech_stack: csv(formData.get("tech_stack")),
      features: csv(formData.get("features")),
      gallery: csv(formData.get("gallery")),
      video_url: String(formData.get("video_url") ?? "") || null,
    })
    .eq("id", projectId);

  if (error) {
    console.error("updateProject:", error.message);
    throw new Error(error.message);
  }

  revalidatePath("/admin/projects");
  revalidatePath("/");
  revalidatePath(`/projects/${parsed.slug}`);
  redirect("/admin/projects");
}

export async function deleteProject(projectId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", projectId);
  if (error) console.error("deleteProject:", error.message);
  revalidatePath("/admin/projects");
  revalidatePath("/");
}
