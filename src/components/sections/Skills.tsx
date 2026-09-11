import { getSkills } from "@/lib/supabase/queries";
import { SkillsGrid } from "./SkillsGrid";

export async function Skills() {
  const skills = await getSkills();

  return (
    <section id="skills" className="relative mx-auto max-w-7xl overflow-hidden px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full border border-accent-dev/10 sm:h-96 sm:w-96" />
      <div className="pointer-events-none absolute right-0 top-10 font-mono text-[9px] uppercase tracking-[0.5em] text-muted/30 [writing-mode:vertical-rl]">
        tools / methods / systems
      </div>

      <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted">03 / What I build with</p>
          <h2 className="mt-4 max-w-lg font-display text-4xl font-bold leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
            Skills that turn ideas into working things.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-6 text-muted sm:text-base">
            Not a list to impress you — a toolkit I use to move from visual concept to usable product.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 max-w-md">
            <div className="rounded-2xl border border-muted/15 bg-surface/50 p-4">
              <span className="font-mono text-[9px] uppercase tracking-widest text-accent-design">01</span>
              <p className="mt-3 font-display text-sm font-semibold">Think visually</p>
            </div>
            <div className="rounded-2xl border border-muted/15 bg-surface/50 p-4">
              <span className="font-mono text-[9px] uppercase tracking-widest text-accent-dev">02</span>
              <p className="mt-3 font-display text-sm font-semibold">Build deliberately</p>
            </div>
          </div>
        </div>

        <div className="relative">
          {skills.length === 0 ? (
            <p className="rounded-3xl border border-muted/15 bg-surface/50 p-6 font-mono text-sm text-muted">
              No skills added yet — populate the `skills` table.
            </p>
          ) : (
            <SkillsGrid skills={skills} />
          )}
        </div>
      </div>
    </section>
  );
}
