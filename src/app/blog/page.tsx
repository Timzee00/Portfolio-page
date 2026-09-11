import type { Metadata } from "next";
import { FiArrowDownRight } from "react-icons/fi";
import { getPublishedBlogPosts } from "@/lib/supabase/queries";
import { BlogList } from "@/components/blog/BlogList";

export const metadata: Metadata = {
  title: "Blog",
  description: "Writing on development, design, and the space between them.",
};

export default async function BlogIndexPage() {
  const posts = await getPublishedBlogPosts();
  const featured = posts[0];

  return (
    <section className="relative overflow-hidden px-4 py-24 sm:px-6 sm:py-32">
      <div className="pointer-events-none absolute left-[8%] top-24 h-48 w-48 rounded-full border border-accent-design/10" />
      <div className="pointer-events-none absolute right-[6%] top-[30rem] h-64 w-64 rounded-full border border-accent-dev/10" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted">Journal / Field notes</p>
            <h1 className="mt-4 max-w-5xl font-display text-5xl font-bold leading-[0.92] tracking-tight sm:text-6xl lg:text-8xl">
              Notes on building things.
            </h1>
          </div>
          <div className="border-l border-muted/20 pl-5 sm:pl-6">
            <p className="max-w-md text-sm leading-6 text-muted sm:text-base">
              Experiments, lessons, design decisions, and the messy middle between an idea and a working product.
            </p>
            {featured && (
              <a href="#latest" className="mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted transition-colors hover:text-accent-dev">
                Start with the latest <FiArrowDownRight size={14} />
              </a>
            )}
          </div>
        </div>

        {posts.length === 0 ? (
          <p className="mt-20 rounded-3xl border border-dashed border-muted/20 bg-surface/40 p-10 font-mono text-sm text-muted">
            No published posts yet. Create one from the admin dashboard and add a cover image to give it a visual identity.
          </p>
        ) : (
          <div id="latest" className="mt-14">
            <BlogList posts={posts} />
          </div>
        )}
      </div>
    </section>
  );
}
