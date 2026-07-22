import { createClient } from "@/lib/supabase/server";
import type {
  Achievement,
  BlogPost,
  Certificate,
  ContactMessage,
  PortfolioReview,
  Project,
  ProjectReview,
  SiteSettings,
  Skill,
  Testimonial,
} from "@/types";

/**
 * All of these fail soft (return []) instead of throwing, so the public
 * site still renders — with empty sections — before Supabase env vars
 * or the schema/seed are set up. Errors are logged server-side so a
 * misconfiguration doesn't fail silently forever.
 */

export async function getPublishedProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getPublishedProjects:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("getProjectBySlug:", error.message);
    return null;
  }
  return data;
}

export async function getSkills(): Promise<Skill[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getSkills:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getAchievements(): Promise<Achievement[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getAchievements:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("pinned", { ascending: false })
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getTestimonials:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString()) // hide future-scheduled posts
    .order("published_at", { ascending: false });

  if (error) {
    console.error("getPublishedBlogPosts:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .maybeSingle();

  if (error) {
    console.error("getBlogPostBySlug:", error.message);
    return null;
  }
  return data;
}

/** Fire-and-forget-safe: swallow errors so a view-count failure never
 *  breaks the page render. */
export async function incrementBlogPostViews(slug: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("increment_blog_post_views", {
    post_slug: slug,
  });
  if (error) console.error("incrementBlogPostViews:", error.message);
}

export async function getCertificates(): Promise<Certificate[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("certificates")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getCertificates:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getPortfolioReviews(): Promise<PortfolioReview[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("portfolio_reviews")
    .select("*")
    .eq("approved", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getPortfolioReviews:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getProjectReviews(projectId: string): Promise<ProjectReview[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_reviews")
    .select("*")
    .eq("project_id", projectId)
    .eq("approved", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getProjectReviews:", error.message);
    return [];
  }
  return data ?? [];
}

// ── Admin-only reads (RLS allows these only when the signed-in user
// is in the admins table — see supabase/migrations/0001_init.sql) ──

export async function getAllMessages(): Promise<ContactMessage[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAllMessages:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getAllProjectsAdmin(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getAllProjectsAdmin:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getAllBlogPostsAdmin(): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAllBlogPostsAdmin:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getAllReviewsAdmin(): Promise<{
  portfolio: PortfolioReview[];
  project: (ProjectReview & { project_title?: string })[];
}> {
  const supabase = await createClient();
  const [portfolioRes, projectRes] = await Promise.all([
    supabase.from("portfolio_reviews").select("*").order("created_at", { ascending: false }),
    supabase
      .from("project_reviews")
      .select("*, projects(title)")
      .order("created_at", { ascending: false }),
  ]);

  if (portfolioRes.error) console.error("getAllReviewsAdmin (portfolio):", portfolioRes.error.message);
  if (projectRes.error) console.error("getAllReviewsAdmin (project):", projectRes.error.message);

  const project = (projectRes.data ?? []).map((r: any) => ({
    ...r,
    project_title: r.projects?.title,
  }));

  return { portfolio: portfolioRes.data ?? [], project };
}

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: true,
  avatar_url: null,
  resume_url: null,
  hero_background_type: "grid",
  hero_background_url: null,
  typing_roles: ["Frontend Developer", "Graphics Designer", "Creative Technologist"],
  social_github: null,
  social_linkedin: null,
  social_instagram: null,
  social_email: null,
  updated_at: new Date().toISOString(),
};

/** Falls back to sensible defaults if the settings row is missing —
 *  e.g. before supabase/migrations/0005_site_settings.sql has run. */
export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", true)
    .maybeSingle();

  if (error) {
    console.error("getSiteSettings:", error.message);
    return DEFAULT_SITE_SETTINGS;
  }
  return data ?? DEFAULT_SITE_SETTINGS;
}
