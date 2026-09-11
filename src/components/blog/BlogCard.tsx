import Link from "next/link";
import type { BlogPost } from "@/types";
import { estimateReadingMinutes } from "@/lib/reading-time";

export function BlogCard({
  post,
  featured = false,
}: {
  post: BlogPost;
  featured?: boolean;
}) {
  const minutes =
    post.reading_time_minutes ?? estimateReadingMinutes(post.content_markdown);

  return (
    <Link
      href={`/blog/${post.slug}`}
      data-cursor="magnetic"
      className={`group block overflow-hidden rounded-[1.6rem] border border-muted/15 bg-surface/70 transition-all duration-500 hover:-translate-y-1 hover:border-accent-design/40 hover:shadow-2xl ${featured ? "md:grid md:grid-cols-[1.25fr_0.75fr]" : ""}`}
    >
      <div className={`relative overflow-hidden bg-background ${featured ? "aspect-[16/10] md:aspect-auto md:min-h-full" : "aspect-[16/9]"}`}>
        {post.cover_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_image_url}
            alt={post.title}
            loading={featured ? "eager" : "lazy"}
            className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
          />
        ) : (
          <div className="relative flex h-full min-h-48 items-end overflow-hidden bg-background p-5">
            <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full border border-accent-design/15" />
            <div className="absolute bottom-6 right-8 h-16 w-16 rounded-full border border-accent-dev/15" />
            <span className="relative font-mono text-[10px] uppercase tracking-[0.22em] text-muted">TIMZEE / JOURNAL</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/75 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 flex max-w-[calc(100%-5rem)] flex-wrap gap-2">
          {post.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/15 bg-background/70 px-2.5 py-1 font-mono text-[10px] text-foreground backdrop-blur-md"
            >
              #{tag}
            </span>
          ))}
        </div>
        <span className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full border border-white/15 bg-background/70 text-lg opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          ↗
        </span>
      </div>

      <div className={`p-5 sm:p-6 ${featured ? "md:flex md:flex-col md:justify-center md:p-8" : ""}`}>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{featured ? "Latest note" : "Journal"}</p>
        <h3 className={`mt-2 font-display font-semibold leading-tight tracking-tight transition-colors group-hover:text-accent-design ${featured ? "text-2xl sm:text-3xl lg:text-4xl" : "text-xl sm:text-2xl"}`}>
          {post.title}
        </h3>
        <p className={`mt-3 text-sm leading-6 text-muted ${featured ? "sm:text-base" : "line-clamp-3"}`}>{post.excerpt}</p>

        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-muted/10 pt-4 font-mono text-[10px] uppercase tracking-wider text-muted">
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
          <span>{post.views.toLocaleString()} views</span>
        </div>
      </div>
    </Link>
  );
}
