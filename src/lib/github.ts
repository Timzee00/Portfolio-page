export type GithubRepo = {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
};

/**
 * Extracts { owner, repo } from a github.com URL. Returns null for
 * anything that isn't a recognizable GitHub repo URL.
 */
export function parseGithubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("github.com")) return null;
    const [owner, repo] = parsed.pathname.replace(/^\/+/, "").split("/");
    if (!owner || !repo) return null;
    return { owner, repo: repo.replace(/\.git$/, "") };
  } catch {
    return null;
  }
}

/** Fetches a repo's README as plain text. Returns null (never throws)
 *  if there's no README, the repo is private, or the request fails —
 *  callers should treat this as "no extra context available." */
export async function fetchRepoReadme(owner: string, repo: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      { headers: { Accept: "application/vnd.github.raw+json" } }
    );
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

/** Top languages by byte count, most-used first. Never throws. */
export async function fetchRepoLanguages(owner: string, repo: string): Promise<string[]> {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) return [];
    const data: Record<string, number> = await res.json();
    return Object.entries(data)
      .sort((a, b) => b[1] - a[1])
      .map(([lang]) => lang);
  } catch {
    return [];
  }
}
/**
 * Public GitHub REST API — no auth token needed for public repos, but
 * that also means a low rate limit (60 req/hr per IP). Fine for
 * occasional admin use; if it becomes a problem, add a GITHUB_TOKEN
 * env var and pass it as an Authorization header here.
 */
export async function fetchGithubRepos(username: string): Promise<GithubRepo[]> {
  const res = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=30`,
    { headers: { Accept: "application/vnd.github+json" } }
  );

  if (!res.ok) {
    throw new Error(
      res.status === 404
        ? `GitHub user "${username}" not found`
        : `GitHub API error (${res.status})`
    );
  }

  return res.json();
}
