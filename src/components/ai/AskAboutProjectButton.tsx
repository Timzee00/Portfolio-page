"use client";

import { useAIChat } from "./AIChatProvider";

export function AskAboutProjectButton({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const { askAbout } = useAIChat();

  return (
    <button
      onClick={() =>
        askAbout(slug, `Explain the "${title}" project — what it does, and why it's interesting.`)
      }
      data-cursor="magnetic"
      className="rounded-full border border-muted/40 px-6 py-2.5 text-sm font-medium hover:border-accent-design hover:text-accent-design"
    >
      Ask AI to explain this project
    </button>
  );
}
