export type { Locale, T } from "./translations";
export { translations } from "./translations";

import { useStore } from "@/lib/habits-store";
import { translations } from "./translations";

export function useLocale() {
  const locale = useStore((s) => s.locale);
  return translations[locale];
}
