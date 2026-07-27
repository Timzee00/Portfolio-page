"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { AboutTimelineItem } from "@/types";

const csv = (v: FormDataEntryValue | null) =>
  String(v ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

/** Parses the "Label|Title|Body" one-per-line textarea format used
 *  for the About timeline — lets the count of items vary without
 *  needing a dynamic add/remove UI. */
function parseTimeline(raw: string): AboutTimelineItem[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^([^|]*)\|([^|]*)\|(.*)$/);
      if (!match) return null;
      const label = match[1] ?? "";
      const title = match[2] ?? "";
      const body = match[3] ?? "";
      return { label: label.trim(), title: title.trim(), body: body.trim() };
    })
    .filter((item): item is AboutTimelineItem => item !== null);
}

export async function updateSiteSettings(formData: FormData) {
  const supabase = await createClient();

  const backgroundType = String(formData.get("hero_background_type") ?? "grid");
  const timelineRaw = String(formData.get("about_timeline") ?? "");
  const knowledgeBase = String(formData.get("ai_knowledge_base") ?? "").trim();

  const { error } = await supabase
    .from("site_settings")
    .update({
      avatar_url: String(formData.get("avatar_url") ?? "") || null,
      resume_url: String(formData.get("resume_url") ?? "") || null,
      hero_background_type: backgroundType,
      hero_background_url: String(formData.get("hero_background_url") ?? "") || null,
      typing_roles: csv(formData.get("typing_roles")),
      social_github: String(formData.get("social_github") ?? "") || null,
      social_linkedin: String(formData.get("social_linkedin") ?? "") || null,
      social_instagram: String(formData.get("social_instagram") ?? "") || null,
      social_email: String(formData.get("social_email") ?? "") || null,
      about_heading:
        String(formData.get("about_heading") ?? "").trim() ||
        "Developer on one side, designer on the other.",
      about_timeline: parseTimeline(timelineRaw),
      ai_knowledge_base: knowledgeBase || null,
    })
    .eq("id", true);

  if (error) {
    console.error("updateSiteSettings:", error.message);
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");
}
