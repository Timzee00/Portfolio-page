"use client";

import { useMemo, useState } from "react";
import type { BlogPost } from "@/types";
import { BlogCard } from "./BlogCard";

const PAGE_SIZE = 6;

export function BlogList({ posts }: { posts: BlogPost[] }) {
  const allTags = useMemo(
    () => Array.from(new Set(posts.flatMap((p) => p.tags))).sort(),
    [posts]
  );
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchesTag = !activeTag || p.tags.includes(activeTag);
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q);
      return matchesTag && matchesQuery;
    });
  }, [posts, activeTag, query]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const isDefaultView = !activeTag && !query.trim();

  return (
    <div>
      <div className="flex flex-col gap-4 border-y border-muted/10 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            data-cursor="magnetic"
            onClick={() => {
              setActiveTag(null);
              setVisibleCount(PAGE_SIZE);
            }}
            className={`shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${
              !activeTag ? "bg-accent-design text-background" : "text-muted hover:text-foreground"
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              type="button"
              key={tag}
              data-cursor="magnetic"
              onClick={() => {
                setActiveTag(tag);
                setVisibleCount(PAGE_SIZE);
              }}
              className={`shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${
                activeTag === tag ? "bg-accent-design text-background" : "text-muted hover:text-foreground"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>

        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setVisibleCount(PAGE_SIZE);
          }}
          placeholder="Search posts…"
          aria-label="Search posts"
          className="w-full rounded-full border border-muted/25 bg-surface px-4 py-2.5 text-sm outline-none placeholder:text-muted/40 focus:border-accent-dev lg:w-72"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 rounded-2xl border border-dashed border-muted/20 bg-surface/40 p-8 font-mono text-sm text-muted">
          No posts match that search.
        </p>
      ) : (
        <>
          <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {visible.map((post, index) => (
              <div key={post.id} className={isDefaultView && index === 0 ? "lg:col-span-2" : ""}>
                <BlogCard post={post} featured={isDefaultView && index === 0} />
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                data-cursor="magnetic"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="rounded-full border border-muted/30 px-6 py-2.5 text-sm font-medium transition-colors hover:border-accent-dev hover:text-accent-dev"
              >
                Load more notes
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
