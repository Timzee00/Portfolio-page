import type { Metadata } from "next";
import { getPublishedBlogPosts } from "@/lib/supabase/queries";
import { BlogList } from "@/components/blog/BlogList";

export const metadata: Metadata = {
  title: "Blog",
  description: "Writing on development, design, and the space between them.",
};

export default async function BlogIndexPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <section className="mx-auto max-w-5xl px-6 py-32">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
        Blog
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold md:text-5xl">
        Notes on building things.
      </h1>

      {posts.length === 0 ? (
        <p className="mt-16 font-mono text-sm text-muted">
          No published posts yet — see supabase/seed.sql for sample data,
          or write your first post once the admin dashboard exists.
        </p>
      ) : (
        <div className="mt-14">
          <BlogList posts={posts} />
        </div>
      )}
    </section>
  );
}
