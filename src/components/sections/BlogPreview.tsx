import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { getPublishedBlogPosts } from "@/lib/supabase/queries";
import { BlogCard } from "@/components/blog/BlogCard";

export async function BlogPreview() {
  const posts = (await getPublishedBlogPosts()).slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section id="journal" className="relative mx-auto max-w-7xl overflow-hidden px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted">05 / Journal</p>
          <h2 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
            Things I&apos;m figuring out in public.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted sm:text-base">
            Build notes, design experiments, lessons from shipping, and the ideas that make the next project better.
          </p>
        </div>
        <Link
          href="/blog"
          data-cursor="magnetic"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-muted/20 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted transition-colors hover:border-accent-dev/50 hover:text-accent-dev"
        >
          Open journal <FiArrowUpRight size={14} />
        </Link>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
