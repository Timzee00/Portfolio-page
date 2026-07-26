"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { fetchGithubRepos, type GithubRepo } from "@/lib/github";

export async function searchGithubRepos(username: string): Promise<
  { repos: GithubRepo[]; error?: string }
> {
  try {
    const repos = await fetchGithubRepos(username);
    return { repos };
  } catch (err) {
    return { repos: [], error: err instanceof Error ? err.message : "Unknown error" };
  }
}

/** Imports a repo as a draft project — never publishes automatically,
 *  so nothing shows up publicly until reviewed in /admin/projects.
 *  Returns { error } instead of throwing, so the caller can show a
 *  clear message instead of an unhandled rejection. */
export async function importGithubRepoAsProject(
  repo: GithubRepo
): Promise<{ error?: string }> {
  const supabase = await createClient();

  const baseSlug = repo.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!baseSlug) {
    return { error: `Couldn't derive a URL slug from "${repo.name}"` };
  }

  // Repo names can collide with an existing project's slug (manually
  // created, or imported before) — the slug column is unique, so find
  // a free variant instead of failing with a raw DB error.
  let slug = baseSlug;
  for (let suffix = 2; suffix <= 20; suffix++) {
    const { data: existing } = await supabase
      .from("projects")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!existing) break;
    slug = `${baseSlug}-${suffix}`;
  }

  const { error } = await supabase.from("projects").insert({
    slug,
    title: repo.name,
    summary: repo.description ?? "Imported from GitHub — add a summary.",
    category: repo.language ?? "Other",
    status: "draft",
    tech_stack: repo.language ? [repo.language] : [],
    github_url: repo.html_url,
    live_url: repo.homepage || null,
  });

  if (error) {
    console.error("importGithubRepoAsProject:", error.message);
    return {
      error: error.code === "42501"
        ? "Not authorized — check you're logged in as an admin"
        : error.message,
    };
  }

  revalidatePath("/admin/projects");
  return {};
}
