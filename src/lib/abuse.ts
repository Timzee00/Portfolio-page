import { createHash } from "crypto";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

function getRequestFingerprint() {
  const headerStore = headers();
  const forwardedFor = headerStore.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || headerStore.get("x-real-ip") || "unknown";

  return createHash("sha256")
    .update(ip)
    .digest("hex")
    .slice(0, 32);
}

export async function allowPublicAction(
  action: string,
  limit: number,
  windowSeconds: number,
  userId?: string | null
) {
  const identity = userId
    ? `user:${userId}`
    : `ip:${getRequestFingerprint()}`;
  const key = `${action}:${identity}`;
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("consume_public_action_rate_limit", {
    p_key: key,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  });

  if (error) {
    // Do not turn a limiter outage into a site-wide outage. Validation and
    // database constraints still remain active; production can later swap
    // this fallback for a dedicated distributed limiter if needed.
    console.error("allowPublicAction:", error.message);
    return true;
  }

  return data === true;
}

export function honeypotTriggered(formData: FormData) {
  return String(formData.get("_website") ?? "").trim().length > 0;
}
