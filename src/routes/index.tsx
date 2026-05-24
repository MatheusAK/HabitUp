import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/pages/HomePage";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Streaks — Habit Tracker" },
      { name: "description", content: "Build daily habits, earn XP, level up, and unlock new styles." },
    ],
  }),
});
