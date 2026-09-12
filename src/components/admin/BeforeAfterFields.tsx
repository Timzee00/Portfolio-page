"use client";

import type { BlogPost } from "@/types";
import { MediaUpload } from "./MediaUpload";

function MediaSide({
  side,
  type,
  mediaUrl,
  projectUrl,
}: {
  side: "before" | "after";
  type: "image" | "video";
  mediaUrl: string | null;
  projectUrl: string | null;
}) {
  const label = side === "before" ? "Before" : "After";

  return (
    <div className="rounded-2xl border border-muted/20 bg-surface/50 p-5">
      <h3 className="font-display text-xl font-semibold">{label}</h3>
      <p className="mt-1 text-sm leading-6 text-muted">
        Add an image or video. You can upload it or paste its direct media link.
      </p>

      <label htmlFor={`${side}_media_type`} className="mt-5 mb-1.5 block text-sm text-muted">
        Media type
      </label>
      <select
        id={`${side}_media_type`}
        name={`${side}_media_type`}
        defaultValue={type}
        className="w-full rounded-xl border border-muted/30 bg-surface px-4 py-2.5 outline-none focus:border-accent-dev"
      >
        <option value="image">Image</option>
        <option value="video">Video</option>
      </select>

      <div className="mt-4">
        <MediaUpload
          name={`${side}_media_url`}
          folder={`blog/${side}-after`}
          accept="image/*,video/mp4,video/webm,video/quicktime"
          defaultValue={mediaUrl ?? undefined}
          label={`Upload ${label.toLowerCase()} media`}
        />
      </div>

      <div className="mt-4">
        <label htmlFor={`${side}_media_link`} className="mb-1.5 block text-sm text-muted">
          Or paste media link
        </label>
        <input
          id={`${side}_media_link`}
          name={`${side}_media_link`}
          type="url"
          placeholder="https://..."
          defaultValue=""
          className="w-full rounded-xl border border-muted/30 bg-surface px-4 py-2.5 outline-none focus:border-accent-dev"
        />
        <p className="mt-1 text-xs text-muted">If you use a link, it will be used instead of the upload.</p>
      </div>

      <div className="mt-4">
        <label htmlFor={`${side}_project_url`} className="mb-1.5 block text-sm text-muted">
          Website link (optional)
        </label>
        <input
          id={`${side}_project_url`}
          name={`${side}_project_url`}
          type="url"
          placeholder="https://your-website.com"
          defaultValue={projectUrl ?? ""}
          className="w-full rounded-xl border border-muted/30 bg-surface px-4 py-2.5 outline-none focus:border-accent-dev"
        />
      </div>
    </div>
  );
}

export function BeforeAfterFields({ post }: { post?: BlogPost }) {
  return (
    <section className="rounded-2xl border border-muted/20 bg-background p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold">Before &amp; After</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">
            Optional. Turn this on when you want to show how a project changed.
            Works for graphics, websites, apps, photos, videos, and more.
          </p>
        </div>
        <label className="flex shrink-0 items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            name="before_after"
            value="true"
            defaultChecked={post?.before_after ?? false}
            className="h-4 w-4 rounded border-muted/30"
          />
          Enable
        </label>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <MediaSide
          side="before"
          type={post?.before_media_type === "video" ? "video" : "image"}
          mediaUrl={post?.before_media_url ?? null}
          projectUrl={post?.before_project_url ?? null}
        />
        <MediaSide
          side="after"
          type={post?.after_media_type === "video" ? "video" : "image"}
          mediaUrl={post?.after_media_url ?? null}
          projectUrl={post?.after_project_url ?? null}
        />
      </div>
    </section>
  );
}
