import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export type SearchResult = {
  type: "project" | "blog" | "skill";
  title: string;
  subtitle: string;
  href: string;
};

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const supabase = await createClient();
  const like = `%${q}%`;

  const [projects, posts, skills] = await Promise.all([
    supabase
      .from("projects")
      .select("title, summary, slug")
      .eq("status", "published")
      .ilike("title", like)
      .limit(5),
    supabase
      .from("blog_posts")
      .select("title, excerpt, slug")
      .eq("status", "published")
      .ilike("title", like)
      .limit(5),
    supabase.from("skills").select("name, category").ilike("name", like).limit(5),
  ]);

  const results: SearchResult[] = [
    ...(projects.data ?? []).map((p) => ({
      type: "project" as const,
      title: p.title,
      subtitle: p.summary,
      href: `/projects/${p.slug}`,
    })),
    ...(posts.data ?? []).map((p) => ({
      type: "blog" as const,
      title: p.title,
      subtitle: p.excerpt,
      href: `/blog/${p.slug}`,
    })),
    ...(skills.data ?? []).map((s) => ({
      type: "skill" as const,
      title: s.name,
      subtitle: s.category,
      href: "/#skills",
    })),
  ];

  return NextResponse.json({ results });
}
