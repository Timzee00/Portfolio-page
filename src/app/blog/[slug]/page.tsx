import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  getBlogPostBySlug,
  getPublishedBlogPosts,
  incrementBlogPostViews,
} from "@/lib/supabase/queries";
import { estimateReadingMinutes } from "@/lib/reading-time";
import { BlogCard } from "@/components/blog/BlogCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  // Fire-and-forget: a view-count hiccup should never break the page.
  incrementBlogPostViews(slug);

  const minutes =
    post.reading_time_minutes ?? estimateReadingMinutes(post.content_markdown);

  const allPosts = await getPublishedBlogPosts();
  const related = allPosts
    .filter((p) => p.slug !== post.slug && p.tags.some((t) => post.tags.includes(t)))
    .slice(0, 2);

  return (
    <article className="mx-auto max-w-2xl px-6 py-32">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.published_at,
            dateModified: post.updated_at,
          }),
        }}
      />
      <div className="flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-surface px-2.5 py-1 font-mono text-xs text-muted"
          >
            #{tag}
          </span>
        ))}
      </div>

      <h1 className="mt-4 font-display text-4xl font-bold md:text-5xl">
        {post.title}
      </h1>

      <div className="mt-4 flex items-center gap-3 font-mono text-xs text-muted">
        {post.published_at && (
          <time dateTime={post.published_at}>
            {new Date(post.published_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        )}
        <span aria-hidden>·</span>
        <span>{minutes} min read</span>
        <span aria-hidden>·</span>
        <span>{post.views + 1} views</span>
      </div>

      <div className="prose mt-10 max-w-none prose-headings:font-display prose-a:text-accent-dev dark:prose-invert">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content_markdown}
        </ReactMarkdown>
      </div>

      {/* Like button + comments are part of the reviews system, Stage 6 */}

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="font-display text-lg font-semibold text-muted">
            Related posts
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2">
            {related.map((p) => (
              <BlogCard key={p.id} post={p} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
