import { getSiteSettings } from "@/lib/supabase/queries";
import { AboutClient } from "./AboutClient";

export async function About() {
  const settings = await getSiteSettings();
  return (
    <AboutClient heading={settings.about_heading} timeline={settings.about_timeline} />
  );
}
