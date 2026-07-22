"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Minimal working cursor: follows the pointer and scales up over
 * [data-cursor="magnetic"] elements. Disabled automatically on touch
 * devices and when reduced motion is preferred. Visual treatment
 * (glow, blend mode, size) belongs to the hero design pass.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const isTouch = matchMedia("(pointer: coarse)").matches;
    const prefersReducedMotion = matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setEnabled(!isTouch && !prefersReducedMotion);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const dot = dotRef.current;
    if (!dot) return;

    const move = (e: MouseEvent) => {
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };

    const onEnter = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest(
        '[data-cursor="magnetic"]'
      );
      dot.style.scale = target ? "2.5" : "1";
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", onEnter);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", onEnter);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent transition-transform duration-150 ease-out mix-blend-difference"
    />
  );
}
