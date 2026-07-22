"use client";

import { useTransition } from "react";

export function DeleteButton({
  action,
  confirmMessage = "Are you sure?",
}: {
  action: () => Promise<void>;
  confirmMessage?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => {
        if (!confirm(confirmMessage)) return;
        startTransition(() => {
          void action();
        });
      }}
      className="text-accent-design hover:underline disabled:opacity-50"
    >
      {pending ? "Deleting…" : "Delete"}
    </button>
  );
}
