import type { BlogMediaType, BlogPost } from "@/types";

function Media({ type, url, label }: { type: BlogMediaType | null; url: string | null; label: string }) {
  if (!url) return null;
  if (type === "video") {
    return <video src={url} controls preload="metadata" className="aspect-video w-full rounded-2xl bg-background object-contain" aria-label={label} />;
  }
  return <img src={url} alt={`${label} version`} className="aspect-video w-full rounded-2xl bg-background object-contain" />;
}

export function BlogBeforeAfter({ post }: { post: BlogPost }) {
  if (!post.before_after) return null;
  const hasBefore = Boolean(post.before_media_url || post.before_project_url);
  const hasAfter = Boolean(post.after_media_url || post.after_project_url);
  if (!hasBefore && !hasAfter) return null;

  return (
    <section className="mt-14 rounded-[2rem] border border-muted/15 bg-surface/50 p-5 sm:p-7" aria-labelledby="before-after-heading">
      <div className="text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted">Project comparison</p>
        <h2 id="before-after-heading" className="mt-2 font-display text-2xl font-bold sm:text-3xl">Before &amp; After</h2>
      </div>
      <div className="mt-7 grid gap-6 md:grid-cols-2">
        {hasBefore && <div><p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">Before</p><Media type={post.before_media_type} url={post.before_media_url} label="Before" />{post.before_project_url && <a href={post.before_project_url} target="_blank" rel="noreferrer" className="mt-3 inline-flex font-mono text-xs uppercase tracking-wider text-accent-dev hover:underline">View before →</a>}</div>}
        {hasAfter && <div><p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">After</p><Media type={post.after_media_type} url={post.after_media_url} label="After" />{post.after_project_url && <a href={post.after_project_url} target="_blank" rel="noreferrer" className="mt-3 inline-flex font-mono text-xs uppercase tracking-wider text-accent-dev hover:underline">View after →</a>}</div>}
      </div>
    </section>
  );
}
