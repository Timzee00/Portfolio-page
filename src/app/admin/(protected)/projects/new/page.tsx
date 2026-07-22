import { ProjectForm } from "@/components/admin/ProjectForm";
import { createProject } from "@/lib/actions/admin/projects";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold">New project</h1>
      <div className="mt-8">
        <ProjectForm action={createProject} />
      </div>
    </div>
  );
}
