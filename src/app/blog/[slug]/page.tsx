import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  getBlogCommentsPage,
  getBlogPostBySlug,
  getPublishedBlogPosts,
  incrementBlogPostViews,
} from "@/lib/supabase/queries";
import { submitBlogComment, loadBlogCommentsPage } from "@/lib/actions/blog-comments";
import { estimateReadingMinutes } from "@/lib/reading-time";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogComments } from "@/components/blog/BlogComments";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      images: post.cover_image_url ? [{ url: post.cover_image_url }] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  // Fire-and-forget: a view-count hiccup should never break the page.
  incrementBlogPostViews(slug);

  const minutes =
    post.reading_time_minutes ?? estimateReadingMinutes(post.content_markdown);

  const [allPosts, commentPage] = await Promise.all([
    getPublishedBlogPosts(),
    getBlogCommentsPage(post.id, 0, 10),
  ]);

  const related = allPosts
    .filter((p) => p.slug !== post.slug && p.tags.some((t) => post.tags.includes(t)))
    .slice(0, 2);

  return (
    <article className="mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32">
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
            image: post.cover_image_url ?? undefined,
          }),
        }}
      />

      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-muted/15 bg-surface px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted"
            >
              #{tag}
            </span>
          ))}
        </div>

        <h1 className="mt-5 font-display text-4xl font-bold leading-[0.98] tracking-tight sm:text-5xl lg:text-7xl">
          {post.title}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-7 text-muted sm:text-lg">{post.excerpt}</p>

        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[10px] uppercase tracking-wider text-muted">
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
          <span>{(post.views + 1).toLocaleString()} views</span>
          <span aria-hidden>·</span>
          <a href="#comments" className="transition-colors hover:text-accent-dev">
            {commentPage.total.toLocaleString()} comments
          </a>
        </div>

        {post.cover_image_url && (
          <div className="mt-10 overflow-hidden rounded-[2rem] border border-muted/15 bg-surface">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="aspect-[16/8] h-auto w-full object-cover"
            />
          </div>
        )}

        <div className="mx-auto mt-12 max-w-3xl prose max-w-none prose-headings:font-display prose-headings:tracking-tight prose-a:text-accent-dev prose-img:rounded-2xl dark:prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content_markdown}
          </ReactMarkdown>
        </div>

        <BlogComments
          postId={post.id}
          comments={commentPage.comments}
          total={commentPage.total}
          submitComment={submitBlogComment.bind(null, post.id, post.slug)}
          loadComments={loadBlogCommentsPage.bind(null, post.id)}
        />

        {related.length > 0 && (
          <div className="mt-20 border-t border-muted/15 pt-12">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted">Keep exploring</p>
                <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Related posts.</h2>
              </div>
              <a href="/blog" className="font-mono text-[10px] uppercase tracking-wider text-muted hover:text-accent-dev">
                All notes →
              </a>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              {related.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
