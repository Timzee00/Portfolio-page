"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Skills, achievements, testimonials, and certificates are simple
// enough (few fields, no drafts/versions) that they share one
// create-and-delete pattern from a single admin page each, rather than
// separate new/edit routes like projects and blog posts. Editing in
// place isn't wired up yet — delete and re-add is the workaround for
// now; see design-notes.md.

export async function createSkill(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("skills").insert({
    name: String(formData.get("name") ?? ""),
    category: String(formData.get("category") ?? ""),
    description: String(formData.get("description") ?? "") || null,
    years_experience: formData.get("years_experience")
      ? Number(formData.get("years_experience"))
      : null,
  });
  if (error) console.error("createSkill:", error.message);
  revalidatePath("/admin/skills");
  revalidatePath("/");
}

export async function deleteSkill(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("skills").delete().eq("id", id);
  if (error) console.error("deleteSkill:", error.message);
  revalidatePath("/admin/skills");
  revalidatePath("/");
}

export async function createAchievement(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("achievements").insert({
    label: String(formData.get("label") ?? ""),
    value: Number(formData.get("value") ?? 0),
    suffix: String(formData.get("suffix") ?? ""),
  });
  if (error) console.error("createAchievement:", error.message);
  revalidatePath("/admin/achievements");
  revalidatePath("/");
}

export async function deleteAchievement(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("achievements").delete().eq("id", id);
  if (error) console.error("deleteAchievement:", error.message);
  revalidatePath("/admin/achievements");
  revalidatePath("/");
}

export async function createTestimonial(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").insert({
    author_name: String(formData.get("author_name") ?? ""),
    author_role: String(formData.get("author_role") ?? "") || null,
    author_company: String(formData.get("author_company") ?? "") || null,
    quote: String(formData.get("quote") ?? ""),
    pinned: formData.get("pinned") === "on",
  });
  if (error) console.error("createTestimonial:", error.message);
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function toggleTestimonialPinned(id: string, pinned: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("testimonials")
    .update({ pinned: !pinned })
    .eq("id", id);
  if (error) console.error("toggleTestimonialPinned:", error.message);
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function deleteTestimonial(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) console.error("deleteTestimonial:", error.message);
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function createCertificate(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("certificates").insert({
    title: String(formData.get("title") ?? ""),
    issuer: String(formData.get("issuer") ?? "") || null,
    image_url: String(formData.get("image_url") ?? "") || null,
    file_url: String(formData.get("file_url") ?? "") || null,
    issued_at: String(formData.get("issued_at") ?? "") || null,
  });
  if (error) console.error("createCertificate:", error.message);
  revalidatePath("/admin/certificates");
  revalidatePath("/");
}

export async function deleteCertificate(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("certificates").delete().eq("id", id);
  if (error) console.error("deleteCertificate:", error.message);
  revalidatePath("/admin/certificates");
  revalidatePath("/");
}
