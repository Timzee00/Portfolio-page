"use client";

import { useState, useTransition } from "react";
import { searchGithubRepos, importGithubRepoAsProject } from "@/lib/actions/admin/github";
import type { GithubRepo } from "@/lib/github";

export function GithubImportClient() {
  const [username, setUsername] = useState("");
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [imported, setImported] = useState<Set<string>>(new Set());
  const [importErrors, setImportErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearchError(null);
    startTransition(async () => {
      const result = await searchGithubRepos(username);
      setRepos(result.repos);
      setSearchError(result.error ?? null);
    });
  }

  function handleImport(repo: GithubRepo) {
    setImportErrors((prev) => {
      const next = { ...prev };
      delete next[repo.full_name];
      return next;
    });
    startTransition(async () => {
      const result = await importGithubRepoAsProject(repo);
      if (result.error) {
        setImportErrors((prev) => ({ ...prev, [repo.full_name]: result.error! }));
        return;
      }
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

      {searchError && <p className="mt-4 text-sm text-accent-design">{searchError}</p>}

      <div className="mt-8 space-y-2">
        {repos.map((repo) => {
          const done = imported.has(repo.full_name);
          const repoError = importErrors[repo.full_name];
          return (
            <div
              key={repo.full_name}
              className="rounded-xl border border-muted/20 bg-surface px-5 py-3"
            >
              <div className="flex items-center justify-between">
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
              {repoError && (
                <p className="mt-2 font-mono text-xs text-accent-design">{repoError}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
