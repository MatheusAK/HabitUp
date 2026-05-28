import { createFileRoute } from "@tanstack/react-router";
import { ProgressPage } from "@/pages/ProgressPage";

export const Route = createFileRoute("/progress")({
  component: ProgressPage,
  head: () => ({
    meta: [
      { title: "Level & Progress — Streaks" },
      { name: "description", content: "View your current level, XP progress, streak impact, and upcoming unlocks." },
    ],
  }),
});
