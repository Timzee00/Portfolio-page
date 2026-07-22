// Hand-written types matching supabase/migrations/0001_init.sql.
// Once the project is linked, regenerate the source of truth with:
//   npx supabase gen types typescript --project-id YOUR_PROJECT_REF > src/types/supabase.ts

export type ProjectStatus = "draft" | "published" | "archived";
export type BlogStatus = "draft" | "published";

export type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string | null;
  category: string;
  status: ProjectStatus;
  tech_stack: string[];
  github_url: string | null;
  live_url: string | null;
  thumbnail_url: string | null;
  gallery: string[];
  video_url: string | null;
  features: string[];
  challenges: string | null;
  solutions: string | null;
  lessons_learned: string | null;
  roadmap: string | null;
  views: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content_markdown: string;
  cover_image_url: string | null;
  tags: string[];
  status: BlogStatus;
  reading_time_minutes: number | null;
  views: number;
  likes: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Skill = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  years_experience: number | null;
  related_project_slugs: string[];
  sort_order: number;
};

export type Achievement = {
  id: string;
  label: string;
  value: number;
  suffix: string;
  sort_order: number;
};

export type Testimonial = {
  id: string;
  author_name: string;
  author_role: string | null;
  author_company: string | null;
  quote: string;
  avatar_url: string | null;
  pinned: boolean;
  sort_order: number;
};

export type Certificate = {
  id: string;
  title: string;
  issuer: string | null;
  image_url: string | null;
  file_url: string | null;
  issued_at: string | null;
  sort_order: number;
};

export type PortfolioReview = {
  id: string;
  user_id: string | null;
  author_name: string;
  rating: number;
  comment: string | null;
  helpful_count: number;
  approved: boolean;
  created_at: string;
};

export type ProjectReview = {
  id: string;
  project_id: string;
  user_id: string | null;
  author_name: string;
  rating: number;
  comment: string | null;
  helpful_count: number;
  approved: boolean;
  created_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean;
  created_at: string;
};

export type HeroBackgroundType = "grid" | "image" | "video";

export type SiteSettings = {
  id: boolean;
  avatar_url: string | null;
  resume_url: string | null;
  hero_background_type: HeroBackgroundType;
  hero_background_url: string | null;
  typing_roles: string[];
  social_github: string | null;
  social_linkedin: string | null;
  social_instagram: string | null;
  social_email: string | null;
  updated_at: string;
};
