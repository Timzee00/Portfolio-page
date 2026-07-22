"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function markMessageRead(id: string, read: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("messages").update({ read: !read }).eq("id", id);
  if (error) console.error("markMessageRead:", error.message);
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("messages").delete().eq("id", id);
  if (error) console.error("deleteMessage:", error.message);
  revalidatePath("/admin/messages");
}
