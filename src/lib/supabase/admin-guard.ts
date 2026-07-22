import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Second layer of defense behind middleware.ts — call this at the top
 * of every admin Server Component/layout. Redirects to /admin/login
 * if there's no signed-in user, or if they aren't in the admins table.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  const { data: adminRow } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminRow) redirect("/admin/login?denied=1");

  return user;
}
