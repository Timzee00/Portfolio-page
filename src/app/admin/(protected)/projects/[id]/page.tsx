import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { updateProject } from "@/lib/actions/admin/projects";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!project) notFound();

  const boundUpdate = updateProject.bind(null, id);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Edit project</h1>
      <div className="mt-8">
        <ProjectForm project={project} action={boundUpdate} />
      </div>
    </div>
  );
}
