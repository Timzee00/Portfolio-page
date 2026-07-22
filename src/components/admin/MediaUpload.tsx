"use client";

import { useRef, useState } from "react";
import { uploadMedia, deleteMedia } from "@/lib/supabase/storage";

type Props = {
  name: string;
  folder: string;
  multiple?: boolean;
  accept?: string;
  defaultValue?: string | string[];
  label?: string;
};

/**
 * Drag-drop upload wired to Supabase Storage. Renders a hidden
 * input (comma-separated for `multiple`) so it slots straight into
 * the existing native <form action={serverAction}> pattern used
 * across the admin — no need to rewrite forms to be fully
 * client-controlled just to support file uploads.
 */
export function MediaUpload({
  name,
  folder,
  multiple = false,
  accept = "image/*",
  defaultValue,
  label = "Drop files here or click to browse",
}: Props) {
  const initial = Array.isArray(defaultValue)
    ? defaultValue
    : defaultValue
      ? [defaultValue]
      : [];
  const [urls, setUrls] = useState<string[]>(initial);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setError(null);
    setUploading(true);

    const files = multiple ? Array.from(fileList) : [fileList[0]];

    try {
      const uploaded = await Promise.all(
        files.map((file) => uploadMedia(file, folder))
      );
      setUrls((prev) => (multiple ? [...prev, ...uploaded] : uploaded));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function removeAt(index: number) {
    const url = urls[index];
    setUrls((prev) => prev.filter((_, i) => i !== index));
    if (url) await deleteMedia(url);
  }

  const isVideo = (url: string) => /\.(mp4|webm)$/i.test(url);
  const isPdf = (url: string) => /\.pdf$/i.test(url);

  const dragIndex = useRef<number | null>(null);

  function handleReorderDrop(targetIndex: number) {
    const from = dragIndex.current;
    dragIndex.current = null;
    if (from === null || from === targetIndex) return;
    setUrls((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
  }

  return (
    <div>
      <input
        type="hidden"
        name={name}
        value={multiple ? urls.join(",") : urls[0] ?? ""}
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
          dragOver ? "border-accent-dev bg-accent-dev/5" : "border-muted/30 hover:border-muted/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <p className="font-mono text-sm text-muted">
          {uploading ? "Uploading…" : label}
        </p>
      </div>

      {error && <p className="mt-2 text-sm text-accent-design">{error}</p>}

      {urls.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {urls.map((url, i) => (
            <div
              key={url}
              draggable={multiple}
              onDragStart={() => {
                dragIndex.current = i;
              }}
              onDragOver={(e) => multiple && e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                handleReorderDrop(i);
              }}
              className={`relative ${multiple ? "cursor-grab active:cursor-grabbing" : ""}`}
              title={multiple ? "Drag to reorder" : undefined}
            >
              {isVideo(url) ? (
                <video src={url} className="h-20 w-20 rounded-lg object-cover" muted />
              ) : isPdf(url) ? (
                <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-surface font-mono text-xs text-muted">
                  PDF
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt="" className="h-20 w-20 rounded-lg object-cover" />
              )}
              {multiple && (
                <span className="absolute bottom-1 left-1 rounded bg-background/80 px-1.5 py-0.5 font-mono text-[10px] text-muted">
                  {i + 1}
                </span>
              )}
              <button
                type="button"
                onClick={() => removeAt(i)}
                aria-label="Remove"
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent-design text-xs text-background"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      {multiple && urls.length > 1 && (
        <p className="mt-2 font-mono text-xs text-muted">
          Drag thumbnails to reorder — position 1 shows first in the gallery.
        </p>
      )}
    </div>
  );
}
