import { getSkills } from "@/lib/supabase/queries";
import { createSkill, deleteSkill } from "@/lib/actions/admin/misc";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function AdminSkillsPage() {
  const skills = await getSkills();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Skills</h1>

      <form action={createSkill} className="mt-8 grid max-w-2xl gap-4 rounded-2xl border border-muted/20 bg-surface p-6 md:grid-cols-2">
        <input name="name" placeholder="Name (e.g. React)" required className="rounded-xl border border-muted/30 bg-background px-4 py-2.5" />
        <input name="category" placeholder="Category (e.g. Frontend)" required className="rounded-xl border border-muted/30 bg-background px-4 py-2.5" />
        <input name="years_experience" type="number" step="0.5" placeholder="Years experience" className="rounded-xl border border-muted/30 bg-background px-4 py-2.5" />
        <input name="description" placeholder="Short description" className="rounded-xl border border-muted/30 bg-background px-4 py-2.5 md:col-span-2" />
        <button type="submit" className="rounded-full bg-accent-design px-6 py-2.5 text-sm font-medium text-background md:col-span-2 md:w-fit">
          Add skill
        </button>
      </form>

      <div className="mt-8 flex flex-wrap gap-2">
        {skills.map((s) => (
          <div key={s.id} className="flex items-center gap-2 rounded-full border border-muted/20 bg-surface px-4 py-2 text-sm">
            <span>{s.name}</span>
            <DeleteButton action={deleteSkill.bind(null, s.id)} confirmMessage={`Delete "${s.name}"?`} />
          </div>
        ))}
      </div>
    </div>
  );
}
