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
