import { createBrowserClient } from "@supabase/ssr";

/**
 * Use this in Client Components ("use client").
 * For Server Components / Route Handlers, use lib/supabase/server.ts instead.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
