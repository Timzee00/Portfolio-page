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
  const { data, error } = await supabase.from("projects").select("*").eq("status", "published").order("sort_order", { ascending: true });
  if (error) { console.error("getPublishedProjects:", error.message); return []; }
  return data ?? [];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("projects").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
  if (error) { console.error("getProjectBySlug:", error.message); return null; }
  return data;
}

export async function getSkills(): Promise<Skill[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("skills").select("*").order("sort_order", { ascending: true });
  if (error) { console.error("getSkills:", error.message); return []; }
  return data ?? [];
}

export async function getAchievements(): Promise<Achievement[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("achievements").select("*").order("sort_order", { ascending: true });
  if (error) { console.error("getAchievements:", error.message); return []; }
  return data ?? [];
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("testimonials").select("*").order("pinned", { ascending: false }).order("sort_order", { ascending: true });
  if (error) { console.error("getTestimonials:", error.message); return []; }
  return data ?? [];
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("blog_posts").select("*").eq("status", "published").lte("published_at", new Date().toISOString()).order("published_at", { ascending: false });
  if (error) { console.error("getPublishedBlogPosts:", error.message); return []; }
  return data ?? [];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug).eq("status", "published").lte("published_at", new Date().toISOString()).maybeSingle();
  if (error) { console.error("getBlogPostBySlug:", error.message); return null; }
  return data;
}

export async function incrementBlogPostViews(slug: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("increment_blog_post_views", { post_slug: slug });
  if (error) console.error("incrementBlogPostViews:", error.message);
}

export async function getCertificates(): Promise<Certificate[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("certificates").select("*").order("sort_order", { ascending: true });
  if (error) { console.error("getCertificates:", error.message); return []; }
  return data ?? [];
}

/**
 * Public reviews are paginated. Only one small page is sent to the browser
 * at a time, while totals and the aggregate rating come from the stats row.
 */
export async function getPortfolioReviewsPage(page = 0, pageSize = 6): Promise<{
  reviews: PortfolioReview[];
  total: number;
  average: number;
}> {
  const supabase = await createClient();
  const safePage = Math.max(0, Math.floor(page));
  const safePageSize = Math.min(12, Math.max(1, Math.floor(pageSize)));
  const from = safePage * safePageSize;
  const to = from + safePageSize - 1;

  const [reviewsRes, statsRes] = await Promise.all([
    supabase
      .from("portfolio_reviews")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .range(from, to),
    supabase
      .from("portfolio_review_stats")
      .select("total_reviews, rating_sum")
      .eq("id", 1)
      .maybeSingle(),
  ]);

  if (reviewsRes.error) {
    console.error("getPortfolioReviewsPage:", reviewsRes.error.message);
    return { reviews: [], total: 0, average: 0 };
  }

  if (statsRes.error) {
    console.error("getPortfolioReviewsPage stats:", statsRes.error.message);
    return { reviews: reviewsRes.data ?? [], total: 0, average: 0 };
  }

  const total = Number(statsRes.data?.total_reviews ?? 0);
  const ratingSum = Number(statsRes.data?.rating_sum ?? 0);
  return {
    reviews: reviewsRes.data ?? [],
    total,
    average: total > 0 ? Number((ratingSum / total).toFixed(1)) : 0,
  };
}

export async function getProjectReviews(projectId: string): Promise<ProjectReview[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("project_reviews").select("*").eq("project_id", projectId).eq("approved", true).order("created_at", { ascending: false });
  if (error) { console.error("getProjectReviews:", error.message); return []; }
  return data ?? [];
}

export async function getAllMessages(): Promise<ContactMessage[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
  if (error) { console.error("getAllMessages:", error.message); return []; }
  return data ?? [];
}

export async function getAllProjectsAdmin(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("projects").select("*").order("sort_order", { ascending: true });
  if (error) { console.error("getAllProjectsAdmin:", error.message); return []; }
  return data ?? [];
}

export async function getAllBlogPostsAdmin(): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
  if (error) { console.error("getAllBlogPostsAdmin:", error.message); return []; }
  return data ?? [];
}

export async function getAllReviewsAdmin(): Promise<{
  portfolio: PortfolioReview[];
  project: (ProjectReview & { project_title?: string })[];
}> {
  const supabase = await createClient();
  const [portfolioRes, projectRes] = await Promise.all([
    supabase.from("portfolio_reviews").select("*").order("created_at", { ascending: false }),
    supabase.from("project_reviews").select("*, projects(title)").order("created_at", { ascending: false }),
  ]);
  if (portfolioRes.error) console.error("getAllReviewsAdmin (portfolio):", portfolioRes.error.message);
  if (projectRes.error) console.error("getAllReviewsAdmin (project):", projectRes.error.message);
  const project = (projectRes.data ?? []).map((r: any) => ({ ...r, project_title: r.projects?.title }));
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
  about_heading: "Developer on one side, designer on the other.",
  about_timeline: [
    { label: "Journey", title: "Started building things", body: "Picked up design tools before code — CorelDRAW and Photoshop first, then taught myself to build the interfaces I was designing." },
    { label: "Education", title: "Formal + self-taught", body: "Structured learning paired with a lot of late nights shipping small projects to see what actually held up in production." },
    { label: "Experience", title: "Client and personal work", body: "Worked across frontend, backend automation, and design — usually on small teams where one person has to cover more than one role." },
    { label: "Mission", title: "Where design and code meet", body: "Most interesting problems live at the seam between how something looks and how it's built. That's the work I keep coming back to." },
  ],
  ai_knowledge_base: null,
  updated_at: new Date().toISOString(),
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", true).maybeSingle();
  if (error) { console.error("getSiteSettings:", error.message); return DEFAULT_SITE_SETTINGS; }
  return data ?? DEFAULT_SITE_SETTINGS;
}
