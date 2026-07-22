import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

async function getCounts() {
  const supabase = await createClient();
  const [projects, posts, messages, portfolioReviews, projectReviews] =
    await Promise.all([
      supabase.from("projects").select("id", { count: "exact", head: true }),
      supabase.from("blog_posts").select("id", { count: "exact", head: true }),
      supabase
        .from("messages")
        .select("id", { count: "exact", head: true })
        .eq("read", false),
      supabase
        .from("portfolio_reviews")
        .select("id", { count: "exact", head: true })
        .eq("approved", false),
      supabase
        .from("project_reviews")
        .select("id", { count: "exact", head: true })
        .eq("approved", false),
    ]);

  return {
    projects: projects.count ?? 0,
    posts: posts.count ?? 0,
    unreadMessages: messages.count ?? 0,
    pendingReviews: (portfolioReviews.count ?? 0) + (projectReviews.count ?? 0),
  };
}

export default async function AdminOverviewPage() {
  const counts = await getCounts();

  const cards = [
    { label: "Projects", value: counts.projects, href: "/admin/projects" },
    { label: "Blog posts", value: counts.posts, href: "/admin/blog" },
    { label: "Unread messages", value: counts.unreadMessages, href: "/admin/messages" },
    { label: "Pending reviews", value: counts.pendingReviews, href: "/admin/reviews" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Overview</h1>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-muted/20 bg-surface p-5 transition-colors hover:border-accent-dev/50"
          >
            <p className="font-display text-3xl font-bold">{card.value}</p>
            <p className="mt-1 text-sm text-muted">{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
