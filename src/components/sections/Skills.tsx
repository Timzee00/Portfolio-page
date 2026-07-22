import { getSkills } from "@/lib/supabase/queries";
import { SkillsGrid } from "./SkillsGrid";

export async function Skills() {
  const skills = await getSkills();

  return (
    <section id="skills" className="mx-auto max-w-5xl px-6 py-32">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
        Skills
      </p>
      <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
        Hover to see the story behind each one.
      </h2>

      {skills.length === 0 ? (
        <p className="mt-16 font-mono text-sm text-muted">
          No skills added yet — populate the `skills` table (see
          supabase/seed.sql for sample data).
        </p>
      ) : (
        <div className="mt-16">
          <SkillsGrid skills={skills} />
        </div>
      )}
    </section>
  );
}
