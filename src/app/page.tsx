import { LoadingScreen } from "@/components/hero/LoadingScreen";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { Skills } from "@/components/sections/Skills";
import { Achievements } from "@/components/sections/Achievements";
import { Projects } from "@/components/sections/Projects";
import { Certificates } from "@/components/sections/Certificates";
import { Testimonials } from "@/components/sections/Testimonials";
import { PortfolioReviews } from "@/components/sections/PortfolioReviews";
import { Contact } from "@/components/sections/Contact";
import { getSiteSettings } from "@/lib/supabase/queries";

export default async function HomePage() {
  const settings = await getSiteSettings();

  return (
    <>
      <LoadingScreen />
      <Hero
        roles={settings.typing_roles}
        avatarUrl={settings.avatar_url}
        resumeUrl={settings.resume_url}
        backgroundType={settings.hero_background_type}
        backgroundUrl={settings.hero_background_url}
      />
      <About />
      <Achievements />
      <Skills />
      <Projects />
      <Certificates />
      <Testimonials />
      <PortfolioReviews />
      <Contact
        socials={{
          github: settings.social_github,
          linkedin: settings.social_linkedin,
          instagram: settings.social_instagram,
          email: settings.social_email,
        }}
      />
    </>
  );
}
