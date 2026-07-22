"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { SearchResult } from "@/app/api/search/route";

const STATIC_LINKS: SearchResult[] = [
  { type: "project", title: "Home", subtitle: "Back to the top", href: "/" },
  { type: "project", title: "Projects", subtitle: "Browse featured work", href: "/#projects" },
  { type: "blog", title: "Blog", subtitle: "Notes on building things", href: "/blog" },
  { type: "project", title: "Contact", subtitle: "Get in touch", href: "/#contact" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>(STATIC_LINKS);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Global Cmd/Ctrl+K toggle
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults(STATIC_LINKS);
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults(STATIC_LINKS);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results ?? []);
        setActiveIndex(0);
      } catch {
        setResults([]);
      }
    }, 250);
    return () => clearTimeout(timeout);
  }, [query]);

  function navigate(href: string) {
    setOpen(false);
    router.push(href);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    }
    if (e.key === "Enter" && results[activeIndex]) {
      navigate(results[activeIndex].href);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center bg-background/80 pt-[15vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-muted/20 bg-surface shadow-2xl"
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search projects, posts, skills… (Esc to close)"
          className="w-full border-b border-muted/20 bg-transparent px-5 py-4 outline-none placeholder:text-muted"
        />
        <div className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 && (
            <p className="px-3 py-6 text-center font-mono text-sm text-muted">
              No results.
            </p>
          )}
          {results.map((result, i) => (
            <button
              key={`${result.type}-${result.href}-${i}`}
              onClick={() => navigate(result.href)}
              onMouseEnter={() => setActiveIndex(i)}
              className={`block w-full rounded-xl px-4 py-3 text-left ${
                i === activeIndex ? "bg-accent-dev/10" : ""
              }`}
            >
              <p className="font-medium">{result.title}</p>
              <p className="truncate font-mono text-xs text-muted">{result.subtitle}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
