"use client";

import { useState, useTransition } from "react";
import { searchGithubRepos, importGithubRepoAsProject } from "@/lib/actions/admin/github";
import type { GithubRepo } from "@/lib/github";

export function GithubImportClient() {
  const [username, setUsername] = useState("");
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [imported, setImported] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await searchGithubRepos(username);
      setRepos(result.repos);
      setError(result.error ?? null);
    });
  }

  function handleImport(repo: GithubRepo) {
    startTransition(async () => {
      await importGithubRepoAsProject(repo);
      setImported((prev) => new Set(prev).add(repo.full_name));
    });
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="flex max-w-md gap-3">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="GitHub username"
          required
          className="flex-1 rounded-xl border border-muted/30 bg-surface px-4 py-2.5 outline-none focus:border-accent-dev"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-accent-design px-6 py-2.5 text-sm font-medium text-background disabled:opacity-50"
        >
          Search
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-accent-design">{error}</p>}

      <div className="mt-8 space-y-2">
        {repos.map((repo) => {
          const done = imported.has(repo.full_name);
          return (
            <div
              key={repo.full_name}
              className="flex items-center justify-between rounded-xl border border-muted/20 bg-surface px-5 py-3"
            >
              <div>
                <p className="font-medium">{repo.name}</p>
                <p className="font-mono text-xs text-muted">
                  ★ {repo.stargazers_count} · ⑂ {repo.forks_count}
                  {repo.language ? ` · ${repo.language}` : ""}
                </p>
              </div>
              <button
                onClick={() => handleImport(repo)}
                disabled={done || isPending}
                className="rounded-full border border-muted/40 px-4 py-1.5 text-sm hover:border-accent-dev hover:text-accent-dev disabled:opacity-50"
              >
                {done ? "Imported ✓" : "Import as draft"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
