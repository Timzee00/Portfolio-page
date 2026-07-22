import type { MetadataRoute } from "next";
import { getPublishedProjects, getPublishedBlogPosts } from "@/lib/supabase/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const [projects, posts] = await Promise.all([
    getPublishedProjects(),
    getPublishedBlogPosts(),
  ]);

  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/blog`, changeFrequency: "weekly", priority: 0.8 },
    ...projects.map((p) => ({
      url: `${base}/projects/${p.slug}`,
      lastModified: p.updated_at,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.updated_at,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
