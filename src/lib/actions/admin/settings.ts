"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const csv = (v: FormDataEntryValue | null) =>
  String(v ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

export async function updateSiteSettings(formData: FormData) {
  const supabase = await createClient();

  const backgroundType = String(formData.get("hero_background_type") ?? "grid");

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
    })
    .eq("id", true);

  if (error) {
    console.error("updateSiteSettings:", error.message);
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");
}
