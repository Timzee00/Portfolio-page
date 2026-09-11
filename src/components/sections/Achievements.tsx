import { getAchievements } from "@/lib/supabase/queries";
import { AchievementCounter } from "./AchievementCounter";

export async function Achievements() {
  const achievements = await getAchievements();
  if (achievements.length === 0) return null;

  return (
    <section id="achievements" className="relative mx-auto max-w-7xl overflow-hidden px-4 py-24 sm:px-6 sm:py-28 lg:px-8">
      <div className="flex flex-col gap-5 border-y border-muted/15 py-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted">02 / Proof, not promises</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">Built. Shipped. Measured.</h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-muted">A few signals from the work — the kind of details that make the rest of this portfolio worth exploring.</p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[2rem] border border-muted/15 bg-muted/10 md:grid-cols-4">
        {achievements.map((a, index) => (
          <div key={a.id} className="group relative min-h-[145px] bg-background p-5 sm:min-h-[175px] sm:p-7">
            <span className="font-mono text-[9px] tracking-[0.2em] text-muted/50">0{index + 1}</span>
            <div className="mt-5 transition-transform duration-300 group-hover:-translate-y-1">
              <AchievementCounter value={a.value} suffix={a.suffix} label={a.label} />
            </div>
            <span className="pointer-events-none absolute -bottom-6 -right-6 h-20 w-20 rounded-full border border-accent-design/10 transition-transform duration-500 group-hover:scale-125" />
          </div>
        ))}
      </div>
    </section>
  );
}
