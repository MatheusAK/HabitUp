import {
  Activity,
  Apple,
  BookOpen,
  Brain,
  Check,
  Droplets,
  Dumbbell,
  Flame,
  Heart,
  Moon,
  Music,
  Palette,
  PawPrint,
  PenLine,
  Sprout,
  Target,
  Trophy,
  Users,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react";

export interface HabitIconDef {
  id: string;
  Icon: LucideIcon;
}

export const HABIT_ICONS: HabitIconDef[] = [
  { id: "check", Icon: Check },
  { id: "droplets", Icon: Droplets },
  { id: "activity", Icon: Activity },
  { id: "bookopen", Icon: BookOpen },
  { id: "brain", Icon: Brain },
  { id: "target", Icon: Target },
  { id: "dumbbell", Icon: Dumbbell },
  { id: "heart", Icon: Heart },
  { id: "sprout", Icon: Sprout },
  { id: "penline", Icon: PenLine },
  { id: "palette", Icon: Palette },
  { id: "moon", Icon: Moon },
  { id: "apple", Icon: Apple },
  { id: "pawprint", Icon: PawPrint },
  { id: "users", Icon: Users },
  { id: "trophy", Icon: Trophy },
  { id: "flame", Icon: Flame },
  { id: "music", Icon: Music },
  { id: "wind", Icon: Wind },
  { id: "zap", Icon: Zap },
];

export const ICON_MAP = new Map<string, LucideIcon>(
  HABIT_ICONS.map(({ id, Icon }) => [id, Icon]),
);

/** Renders a lucide icon if the id is known; falls back to plain text for legacy emoji strings. */
export function HabitIcon({
  id,
  className = "h-6 w-6",
}: {
  id: string;
  className?: string;
}) {
  const Icon = ICON_MAP.get(id);
  if (Icon) return <Icon className={className} />;
  return <span className="text-xl leading-none">{id}</span>;
}
