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
 *  so nothing shows up publicly until reviewed in /admin/projects. */
export async function importGithubRepoAsProject(repo: GithubRepo) {
  const supabase = await createClient();

  const slug = repo.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

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
    throw new Error(error.message);
  }

  revalidatePath("/admin/projects");
}
