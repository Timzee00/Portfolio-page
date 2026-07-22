import { getAchievements } from "@/lib/supabase/queries";
import { createAchievement, deleteAchievement } from "@/lib/actions/admin/misc";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function AdminAchievementsPage() {
  const achievements = await getAchievements();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Achievements</h1>
      <p className="mt-1 text-sm text-muted">
        Shown as animated counters on the homepage.
      </p>

      <form action={createAchievement} className="mt-8 flex max-w-2xl flex-wrap items-end gap-4 rounded-2xl border border-muted/20 bg-surface p-6">
        <div>
          <label className="mb-1.5 block text-sm text-muted">Label</label>
          <input name="label" placeholder="Projects completed" required className="rounded-xl border border-muted/30 bg-background px-4 py-2.5" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-muted">Value</label>
          <input name="value" type="number" required className="w-28 rounded-xl border border-muted/30 bg-background px-4 py-2.5" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-muted">Suffix</label>
          <input name="suffix" placeholder="+" className="w-20 rounded-xl border border-muted/30 bg-background px-4 py-2.5" />
        </div>
        <button type="submit" className="rounded-full bg-accent-design px-6 py-2.5 text-sm font-medium text-background">
          Add
        </button>
      </form>

      <div className="mt-8 space-y-2">
        {achievements.map((a) => (
          <div key={a.id} className="flex items-center justify-between rounded-xl border border-muted/20 bg-surface px-5 py-3">
            <span>{a.label}: {a.value}{a.suffix}</span>
            <DeleteButton action={deleteAchievement.bind(null, a.id)} confirmMessage={`Delete "${a.label}"?`} />
          </div>
        ))}
      </div>
    </div>
  );
}
