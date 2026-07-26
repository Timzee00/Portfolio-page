import type { AboutTimelineItem } from "@/types";

export function serializeTimeline(items: AboutTimelineItem[]): string {
  return items.map((i) => `${i.label}|${i.title}|${i.body}`).join("\n");
}
