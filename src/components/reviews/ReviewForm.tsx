"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { StarRating } from "./StarRating";
import type { ReviewFormState } from "@/lib/actions/reviews";

const initialState: ReviewFormState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      data-cursor="magnetic"
      className="rounded-full bg-accent-design px-6 py-2.5 text-sm font-medium text-background disabled:opacity-50"
    >
      {pending ? "Submitting…" : "Submit review"}
    </button>
  );
}

export function ReviewForm({
  action,
}: {
  action: (prev: ReviewFormState, formData: FormData) => Promise<ReviewFormState>;
}) {
  const [state, formAction] = useFormState(action, initialState);
  const [rating, setRating] = useState(5);

  return (
    <form action={formAction} className="space-y-4 rounded-2xl border border-muted/20 bg-surface p-6">
      <div>
        <label className="mb-1.5 block text-sm text-muted">Your rating</label>
        <StarRating value={rating} onChange={setRating} />
        <input type="hidden" name="rating" value={rating} />
      </div>
      <div>
        <label htmlFor="author_name" className="mb-1.5 block text-sm text-muted">
          Name
        </label>
        <input
          id="author_name"
          name="author_name"
          required
          className="w-full rounded-xl border border-muted/30 bg-background px-4 py-2.5 outline-none focus:border-accent-dev"
        />
      </div>
      <div>
        <label htmlFor="comment" className="mb-1.5 block text-sm text-muted">
          Comment (optional)
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={3}
          className="w-full rounded-xl border border-muted/30 bg-background px-4 py-2.5 outline-none focus:border-accent-dev"
        />
      </div>
      <SubmitButton />
      {state.status !== "idle" && (
        <p className={`text-sm ${state.status === "success" ? "text-accent-dev" : "text-accent-design"}`}>
          {state.message}
        </p>
      )}
    </form>
  );
}
