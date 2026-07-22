"use client";

import type { Project } from "@/types";
import { MediaUpload } from "./MediaUpload";

export function ProjectForm({
  project,
  action,
}: {
  project?: Project;
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={action} className="max-w-2xl space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Title" name="title" defaultValue={project?.title} required />
        <Field
          label="Slug"
          name="slug"
          defaultValue={project?.slug}
          required
          hint="lowercase-with-hyphens"
        />
      </div>

      <Field label="Summary" name="summary" defaultValue={project?.summary} required />

      <div>
        <label className="mb-1.5 block text-sm text-muted">Description</label>
        <textarea
          name="description"
          rows={4}
          defaultValue={project?.description ?? ""}
          className="w-full rounded-xl border border-muted/30 bg-surface px-4 py-2.5 outline-none focus:border-accent-dev"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Category" name="category" defaultValue={project?.category} required />
        <div>
          <label className="mb-1.5 block text-sm text-muted">Status</label>
          <select
            name="status"
            defaultValue={project?.status ?? "draft"}
            className="w-full rounded-xl border border-muted/30 bg-surface px-4 py-2.5 outline-none focus:border-accent-dev"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <Field
        label="Tech stack (comma-separated)"
        name="tech_stack"
        defaultValue={project?.tech_stack?.join(", ")}
      />
      <Field
        label="Features (comma-separated)"
        name="features"
        defaultValue={project?.features?.join(", ")}
      />

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="GitHub URL" name="github_url" defaultValue={project?.github_url ?? ""} />
        <Field label="Live URL" name="live_url" defaultValue={project?.live_url ?? ""} />
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-muted">Thumbnail</label>
        <MediaUpload
          name="thumbnail_url"
          folder="projects"
          accept="image/*"
          defaultValue={project?.thumbnail_url ?? undefined}
          label="Drop a thumbnail image, or click to browse"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-muted">Gallery</label>
        <MediaUpload
          name="gallery"
          folder="projects"
          accept="image/*"
          multiple
          defaultValue={project?.gallery ?? []}
          label="Drop gallery images, or click to browse (multiple allowed)"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-muted">Demo video (optional)</label>
        <MediaUpload
          name="video_url"
          folder="projects"
          accept="video/*"
          defaultValue={project?.video_url ?? undefined}
          label="Drop a short demo video, or click to browse"
        />
      </div>

      <TextArea label="Challenges" name="challenges" defaultValue={project?.challenges ?? ""} />
      <TextArea label="Solutions" name="solutions" defaultValue={project?.solutions ?? ""} />
      <TextArea
        label="Lessons learned"
        name="lessons_learned"
        defaultValue={project?.lessons_learned ?? ""}
      />

      <button
        type="submit"
        className="rounded-full bg-accent-design px-6 py-2.5 text-sm font-medium text-background"
      >
        {project ? "Save changes" : "Create project"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm text-muted">
        {label}
      </label>
      <input
        id={name}
        name={name}
        required={required}
        defaultValue={defaultValue}
        className="w-full rounded-xl border border-muted/30 bg-surface px-4 py-2.5 outline-none focus:border-accent-dev"
      />
      {hint && <p className="mt-1 font-mono text-xs text-muted">{hint}</p>}
    </div>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm text-muted">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={3}
        defaultValue={defaultValue}
        className="w-full rounded-xl border border-muted/30 bg-surface px-4 py-2.5 outline-none focus:border-accent-dev"
      />
    </div>
  );
}
