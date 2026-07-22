"use client";

import { useEffect, useState } from "react";

export function TypingRole({ roles }: { roles: string[] }) {
  const [text, setText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced) {
      setText(roles[0] ?? "");
      return;
    }

    const current = roles[roleIndex % roles.length] ?? "";
    const typingSpeed = deleting ? 40 : 70;
    const atFullWord = !deleting && text === current;
    const atEmpty = deleting && text === "";

    const timeout = setTimeout(
      () => {
        if (atFullWord) {
          setDeleting(true);
          return;
        }
        if (atEmpty) {
          setDeleting(false);
          setRoleIndex((i) => (i + 1) % roles.length);
          return;
        }
        setText(
          deleting
            ? current.slice(0, text.length - 1)
            : current.slice(0, text.length + 1)
        );
      },
      atFullWord ? 1400 : atEmpty ? 300 : typingSpeed
    );

    return () => clearTimeout(timeout);
  }, [text, deleting, roleIndex, roles, reduced]);

  return (
    <span>
      {text}
      {!reduced && <span className="animate-pulse">|</span>}
    </span>
  );
}
