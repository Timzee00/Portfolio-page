import { getAchievements } from "@/lib/supabase/queries";
import { AchievementCounter } from "./AchievementCounter";

export async function Achievements() {
  const achievements = await getAchievements();
  if (achievements.length === 0) return null;

  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
        {achievements.map((a) => (
          <AchievementCounter key={a.id} value={a.value} suffix={a.suffix} label={a.label} />
        ))}
      </div>
    </section>
  );
}
