"use client";

import { ThemeProvider } from "./ThemeProvider";
import { SmoothScroll } from "./SmoothScroll";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SmoothScroll>{children}</SmoothScroll>
    </ThemeProvider>
  );
}
