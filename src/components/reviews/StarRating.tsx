"use client";

import { useState } from "react";
import { FiStar } from "react-icons/fi";

export function StarRating({
  value,
  onChange,
  readOnly = false,
  size = 18,
}: {
  value: number;
  onChange?: (v: number) => void;
  readOnly?: boolean;
  size?: number;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const display = hovered ?? value;

  return (
    <div className="flex gap-0.5" role={readOnly ? undefined : "radiogroup"} aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(null)}
          onClick={() => onChange?.(star)}
          className={readOnly ? "cursor-default" : "cursor-pointer"}
        >
          <FiStar
            size={size}
            className={star <= display ? "fill-accent-design text-accent-design" : "text-muted/40"}
          />
        </button>
      ))}
    </div>
  );
}
