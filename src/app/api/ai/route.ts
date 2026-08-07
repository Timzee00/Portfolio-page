import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { askGroq } from "@/lib/ai/groq";
import { parseGithubUrl, fetchRepoReadme, fetchRepoLanguages } from "@/lib/github";
import {
  getPublishedProjects,
  getProjectBySlug,
  getSiteSettings,
} from "@/lib/supabase/queries";

const RequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(2000),
      })
    )
    .min(1)
    .max(20), // caps context size sent to Groq each call
  projectSlug: z.string().optional(),
});

export async function POST(request: NextRequest) {
  let parsed;
  try {
    parsed = RequestSchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { messages, projectSlug } = parsed;

  const [settings, projects] = await Promise.all([
    getSiteSettings(),
    getPublishedProjects(),
  ]);

  const projectList = projects
    .map((p) => `- ${p.title} (${p.category}): ${p.summary}`)
    .join("\n");

  let focusedProjectBlock = "";
  if (projectSlug) {
    const project = await getProjectBySlug(projectSlug);
    if (project) {
      focusedProjectBlock = `

The visitor is currently viewing this project — prioritize this over the summary list above when answering:
Title: ${project.title}
Category: ${project.category}
Summary: ${project.summary}
Description: ${project.description ?? "(none provided)"}
Tech stack: ${project.tech_stack.join(", ") || "(none listed)"}
Features: ${project.features.join(", ") || "(none listed)"}
Challenges: ${project.challenges ?? "(none provided)"}
Solutions: ${project.solutions ?? "(none provided)"}
Lessons learned: ${project.lessons_learned ?? "(none provided)"}`;

      // Pull real repo content when available — a README says more
      // about what a project actually does than a short DB summary.
      // Best-effort: github.ts's fetch helpers never throw, they
      // return null/[] on any failure (private repo, no README, rate
      // limit) so a GitHub hiccup never breaks the chat response.
      if (project.github_url) {
        const parsed = parseGithubUrl(project.github_url);
        if (parsed) {
          const [readme, languages] = await Promise.all([
            fetchRepoReadme(parsed.owner, parsed.repo),
            fetchRepoLanguages(parsed.owner, parsed.repo),
          ]);
          if (languages.length > 0) {
            focusedProjectBlock += `\nLanguages (by code volume): ${languages.slice(0, 5).join(", ")}`;
          }
          if (readme) {
            // Cap length — keeps the prompt (and Groq token usage) bounded
            // even for very long READMEs.
            focusedProjectBlock += `\n\nREADME from the GitHub repo:\n${readme.slice(0, 4000)}`;
          }
        }
      }
    }
  }

  const systemPrompt = `You are TIMA (Timzee Intelligent Mobile Assistant) an AI assistant created by timzee embedded in TIMZEE's portfolio website. TIMZEE is a creative developer and graphics designer. You help visitors (recruiters, clients, other developers) understand who TIMZEE is and what they've built.

Rules:
- Answer only using the information given below. If something isn't covered, say you don't have that detail rather than guessing or inventing specifics.
- Keep answers conversational and concise (a few sentences, not an essay) unless asked to elaborate.
- You can summarize, explain, and compare projects, and answer general questions about TIMZEE's skills and background.
- Never claim to be TIMZEE himself — you're TIMA an assistant describing him in the third person.

TIMZEE's roles/focus areas: ${settings.typing_roles.join(", ")}
${settings.ai_knowledge_base ? `\nAdditional background on TIMZEE:\n${settings.ai_knowledge_base}\n` : ""}
Published projects:
${projectList || "(no published projects yet)"}${focusedProjectBlock}`;

  try {
    const reply = await askGroq([
      { role: "system", content: systemPrompt },
      ...messages,
    ]);
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("AI chat error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "AI request failed" },
      { status: 500 }
    );
  }
}
