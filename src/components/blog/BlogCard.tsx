import Link from "next/link";
import type { BlogPost } from "@/types";
import { estimateReadingMinutes } from "@/lib/reading-time";

export function BlogCard({ post }: { post: BlogPost }) {
  const minutes =
    post.reading_time_minutes ?? estimateReadingMinutes(post.content_markdown);

  return (
    <Link
      href={`/blog/${post.slug}`}
      data-cursor="magnetic"
      className="group block rounded-2xl border border-muted/20 bg-surface p-6 transition-colors hover:border-accent-design/50"
    >
      <div className="flex flex-wrap items-center gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-background px-2.5 py-1 font-mono text-xs text-muted"
          >
            #{tag}
          </span>
        ))}
      </div>

      <h3 className="mt-4 font-display text-xl font-semibold group-hover:text-accent-design">
        {post.title}
      </h3>
      <p className="mt-2 text-sm text-muted">{post.excerpt}</p>

      <div className="mt-5 flex items-center gap-3 font-mono text-xs text-muted">
        {post.published_at && (
          <time dateTime={post.published_at}>
            {new Date(post.published_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>
        )}
        <span aria-hidden>·</span>
        <span>{minutes} min read</span>
        <span aria-hidden>·</span>
        <span>{post.views} views</span>
      </div>
    </Link>
  );
}
