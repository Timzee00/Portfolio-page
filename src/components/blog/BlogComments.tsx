"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { FiMessageCircle } from "react-icons/fi";
import type { BlogComment } from "@/types";
import type { BlogCommentFormState } from "@/lib/actions/blog-comments";

const initialState: BlogCommentFormState = { status: "idle" };

type CommentPage = {
  comments: BlogComment[];
  total: number;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      data-cursor="magnetic"
      className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent-design px-6 py-2.5 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-50"
    >
      {pending ? "Posting…" : "Post comment"}
    </button>
  );
}

export function BlogComments({
  postId,
  comments: initialComments,
  total: initialTotal,
  submitComment,
  loadComments,
}: {
  postId: string;
  comments: BlogComment[];
  total: number;
  submitComment: (
    prev: BlogCommentFormState,
    formData: FormData
  ) => Promise<BlogCommentFormState>;
  loadComments: (page: number) => Promise<CommentPage>;
}) {
  const [comments, setComments] = useState(initialComments);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [state, formAction] = useFormState(submitComment, initialState);

  async function handleLoadMore() {
    if (loadingMore || comments.length >= total) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const result = await loadComments(nextPage);
      setComments((current) => [...current, ...result.comments]);
      setTotal(result.total);
      setPage(nextPage);
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <section id="comments" className="mt-20 border-t border-muted/15 pt-12">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-muted">
            <FiMessageCircle size={13} /> Discussion
          </div>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Join the conversation.</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
            Share your take, ask a question, or add something useful to the discussion.
          </p>
        </div>
        <span className="font-mono text-xs text-muted">
          {total.toLocaleString()} comment{total === 1 ? "" : "s"}
        </span>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          {comments.length > 0 ? (
            <div className="space-y-3">
              {comments.map((comment) => (
                <article
                  key={comment.id}
                  className="rounded-2xl border border-muted/15 bg-surface/70 p-5 sm:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{comment.author_name}</p>
                      <time
                        dateTime={comment.created_at}
                        className="mt-1 block font-mono text-[10px] uppercase tracking-wider text-muted"
                      >
                        {new Date(comment.created_at).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-accent-dev/70">
                      reader
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-muted">{comment.comment}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-muted/20 bg-surface/40 p-8 text-sm text-muted">
              Be the first reader to start the discussion.
            </div>
          )}

          {comments.length < total && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => void handleLoadMore()}
                disabled={loadingMore}
                data-cursor="magnetic"
                className="rounded-full border border-muted/25 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors hover:border-accent-dev/50 hover:text-accent-dev disabled:opacity-50"
              >
                {loadingMore ? "Loading…" : "Load more comments"}
              </button>
            </div>
          )}
        </div>

        <form
          action={formAction}
          className="h-fit rounded-3xl border border-muted/20 bg-surface p-5 sm:p-6 lg:sticky lg:top-28"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">Add yours</p>
          <h3 className="mt-2 font-display text-2xl font-semibold">What do you think?</h3>

          <div className="mt-5 space-y-4">
            <div>
              <label htmlFor="blog-comment-author" className="mb-1.5 block text-sm text-muted">
                Name
              </label>
              <input
                id="blog-comment-author"
                name="author_name"
                required
                maxLength={120}
                autoComplete="name"
                placeholder="Your name"
                className="min-h-12 w-full rounded-2xl border border-muted/25 bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted/35 focus:border-accent-dev"
              />
            </div>

            <div>
              <label htmlFor="blog-comment-body" className="mb-1.5 block text-sm text-muted">
                Comment
              </label>
              <textarea
                id="blog-comment-body"
                name="comment"
                required
                maxLength={2000}
                rows={6}
                placeholder="Add something useful to the discussion…"
                className="w-full resize-y rounded-2xl border border-muted/25 bg-background px-4 py-3 text-sm leading-6 outline-none transition-colors placeholder:text-muted/35 focus:border-accent-dev"
              />
            </div>

            <div className="sr-only" aria-hidden="true">
              <label htmlFor={`blog-${postId}-website`}>Website</label>
              <input
                id={`blog-${postId}-website`}
                name="_website"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <SubmitButton />

            <p className="text-[11px] leading-5 text-muted">
              Comments are moderated before they appear publicly.
            </p>

            {state.status !== "idle" && (
              <p
                role="status"
                className={`text-sm ${state.status === "success" ? "text-accent-dev" : "text-accent-design"}`}
              >
                {state.message}
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
