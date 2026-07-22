"use client";

import type { BlogPost } from "@/types";
import { MediaUpload } from "./MediaUpload";

/** datetime-local inputs need "YYYY-MM-DDTHH:mm" in local time, not ISO. */
function toDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export function BlogPostForm({
  post,
  action,
}: {
  post?: BlogPost;
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={action} className="max-w-3xl space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="title" className="mb-1.5 block text-sm text-muted">
            Title
          </label>
          <input
            id="title"
            name="title"
            required
            defaultValue={post?.title}
            className="w-full rounded-xl border border-muted/30 bg-surface px-4 py-2.5 outline-none focus:border-accent-dev"
          />
        </div>
        <div>
          <label htmlFor="slug" className="mb-1.5 block text-sm text-muted">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            required
            defaultValue={post?.slug}
            className="w-full rounded-xl border border-muted/30 bg-surface px-4 py-2.5 outline-none focus:border-accent-dev"
          />
        </div>
      </div>

      <div>
        <label htmlFor="excerpt" className="mb-1.5 block text-sm text-muted">
          Excerpt
        </label>
        <input
          id="excerpt"
          name="excerpt"
          required
          defaultValue={post?.excerpt}
          className="w-full rounded-xl border border-muted/30 bg-surface px-4 py-2.5 outline-none focus:border-accent-dev"
        />
      </div>

      <div>
        <label htmlFor="content_markdown" className="mb-1.5 block text-sm text-muted">
          Content (Markdown, GFM supported)
        </label>
        <textarea
          id="content_markdown"
          name="content_markdown"
          required
          rows={16}
          defaultValue={post?.content_markdown}
          className="w-full rounded-xl border border-muted/30 bg-surface px-4 py-2.5 font-mono text-sm outline-none focus:border-accent-dev"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="tags" className="mb-1.5 block text-sm text-muted">
            Tags (comma-separated)
          </label>
          <input
            id="tags"
            name="tags"
            defaultValue={post?.tags?.join(", ")}
            className="w-full rounded-xl border border-muted/30 bg-surface px-4 py-2.5 outline-none focus:border-accent-dev"
          />
        </div>
        <div>
          <label htmlFor="status" className="mb-1.5 block text-sm text-muted">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={post?.status ?? "draft"}
            className="w-full rounded-xl border border-muted/30 bg-surface px-4 py-2.5 outline-none focus:border-accent-dev"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-muted">Cover image</label>
        <MediaUpload
          name="cover_image_url"
          folder="blog"
          accept="image/*"
          defaultValue={post?.cover_image_url ?? undefined}
          label="Drop a cover image, or click to browse"
        />
      </div>

      <div>
        <label htmlFor="published_at" className="mb-1.5 block text-sm text-muted">
          Publish date (optional — leave blank to publish immediately when status is Published)
        </label>
        <input
          id="published_at"
          name="published_at"
          type="datetime-local"
          defaultValue={
            post?.published_at ? toDatetimeLocal(post.published_at) : ""
          }
          className="w-full rounded-xl border border-muted/30 bg-surface px-4 py-2.5 outline-none focus:border-accent-dev"
        />
        <p className="mt-1 font-mono text-xs text-muted">
          A future date + status "Published" schedules the post — it stays
          hidden from the public blog until that time passes.
        </p>
      </div>

      <button
        type="submit"
        className="rounded-full bg-accent-design px-6 py-2.5 text-sm font-medium text-background"
      >
        {post ? "Save changes" : "Create post"}
      </button>
    </form>
  );
}
