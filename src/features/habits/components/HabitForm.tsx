import { useEffect, useState, useRef } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { addHabit, updateHabit, TAGS, useStore, type Habit } from "@/lib/habits-store";
import { useLocale } from "@/lib/i18n";
import { HABIT_ICONS, HabitIcon } from "../habitIcons";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

const WEEKDAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TAG_COLORS_SEMANTIC: Record<string, string> = {
  health: "#22c55e",     // Green
  focus: "#3b82f6",      // Blue
  mind: "#a855f7",       // Purple
  fitness: "#f97316",    // Orange
  creative: "#eab308",   // Yellow
  legend: "#8b5cf6",     // Violet
};

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-2">
      {Array.from({ length: totalSteps }).map((_, idx) => (
        <div
          key={idx}
          className={cn(
            "h-2 rounded-full transition-all duration-300",
            idx === currentStep
              ? "w-8 bg-primary"
              : idx < currentStep
                ? "w-2 bg-primary/60"
                : "w-2 bg-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );
}

export function HabitForm({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing?: Habit | null;
}) {
  const t = useLocale();
  const customTags = useStore((s) => s.customTags);
  const [currentStep, setCurrentStep] = useState(0);
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [iconId, setIconId] = useState("check");
  const [selectedIconName, setSelectedIconName] = useState("Check");
  const [mainFreq, setMainFreq] = useState<"regular" | "once">("regular");
  const [regularType, setRegularType] = useState<"daily" | "specific">("daily");
  const [scheduledDays, setScheduledDays] = useState<number[]>([]);
  const [endDate, setEndDate] = useState("");
  const [tagIds, setTagIds] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const allAvailableTags = [...TAGS, ...customTags];
  const totalSteps = 3;

  // Reset form when opening/closing
  useEffect(() => {
    if (!open) {
      setCurrentStep(0);
      setTitle("");
      setTitleError("");
      setIconId("check");
      setSelectedIconName("Check");
      setMainFreq("regular");
      setRegularType("daily");
      setScheduledDays([]);
      setEndDate("");
      setTagIds([]);
      return;
    }

    if (editing) {
      setTitle(editing.title ?? "");
      setIconId(editing.emoji ?? "check");
      const iconDef = HABIT_ICONS.find((i) => i.id === editing.emoji);
      setSelectedIconName(iconDef?.id ?? "Check");
      setEndDate(editing.endDate ?? "");
      setTagIds(editing.tagIds ?? []);

      const freq = editing.frequency ?? "daily";
      if (freq === "once") {
        setMainFreq("once");
        setRegularType("daily");
        setScheduledDays([]);
      } else if (freq === "specific") {
        setMainFreq("regular");
        setRegularType("specific");
        setScheduledDays(editing.scheduledDays ?? []);
      } else {
        setMainFreq("regular");
        setRegularType("daily");
        setScheduledDays([]);
      }
    }
  }, [open, editing]);

  // Focus title input on step 0
  useEffect(() => {
    if (open && currentStep === 0 && titleInputRef.current) {
      setTimeout(() => titleInputRef.current?.focus(), 100);
    }
  }, [open, currentStep]);

  const toggleDay = (day: number) =>
    setScheduledDays((cur) =>
      cur.includes(day) ? cur.filter((d) => d !== day) : [...cur, day],
    );

  const validateStep = (step: number): boolean => {
    if (step === 0) {
      if (!title.trim()) {
        setTitleError(t.titleRequired);
        return false;
      }
      setTitleError("");
      return true;
    }
    if (step === 1) {
      if (mainFreq === "regular" && regularType === "specific" && scheduledDays.length === 0) {
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < totalSteps - 1) {
      setCurrentStep((s) => s + 1);
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const save = () => {
    if (!validateStep(0)) return;
    if (mainFreq === "regular" && regularType === "specific" && scheduledDays.length === 0)
      return;

    const frequency =
      mainFreq === "once" ? "once" : regularType === "specific" ? "specific" : "daily";

    const payload = {
      title: title.trim(),
      emoji: iconId,
      frequency: frequency as Habit["frequency"],
      scheduledDays: frequency === "specific" ? scheduledDays : undefined,
      endDate: endDate || undefined,
      tagIds,
    };

    if (editing) updateHabit(editing.id, payload);
    else addHabit(payload);
    onOpenChange(false);
  };

  const handleIconSelect = (id: string) => {
    setIconId(id);
    const iconDef = HABIT_ICONS.find((i) => i.id === id);
    setSelectedIconName(iconDef?.id ?? id);
  };

  const getTagColor = (tagId: string): string => {
    const semanticColor = TAG_COLORS_SEMANTIC[tagId];
    if (semanticColor) return semanticColor;
    const tag = allAvailableTags.find((t) => t.id === tagId);
    return tag?.color ?? "#6b7280";
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="border-b border-border/50 pb-3">
          <div className="flex items-center justify-between">
            {currentStep > 0 ? (
              <button
                type="button"
                onClick={prevStep}
                className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-accent"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            ) : (
              <div className="w-8" />
            )}
            <DrawerTitle className="text-base">
              {editing ? t.editHabit : t.newHabit}
            </DrawerTitle>
            <DrawerClose className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-accent">
              <X className="h-5 w-5" />
            </DrawerClose>
          </div>
          <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
        </DrawerHeader>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-4"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 16px)" }}
        >
          {/* Step 0: Title + Icon */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">{t.titleLabel} *</Label>
                <Input
                  ref={titleInputRef}
                  id="title"
                  autoFocus
                  placeholder={t.titlePlaceholder}
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (e.target.value.trim()) setTitleError("");
                  }}
                  className={cn(titleError && "border-destructive focus-visible:ring-destructive")}
                />
                {titleError && (
                  <p className="text-xs text-destructive">{titleError}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>{t.iconLabel}</Label>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Selected:</span>
                  <Badge variant="secondary" className="gap-1.5">
                    {HABIT_ICONS.find((i) => i.id === iconId)?.Icon && (
                      <HabitIcon id={iconId} className="h-4 w-4" />
                    )}
                    {selectedIconName}
                  </Badge>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {HABIT_ICONS.map(({ id, Icon }) => {
                    const isSelected = iconId === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => handleIconSelect(id)}
                        aria-label={id}
                        aria-pressed={isSelected}
                        className={cn(
                          "flex h-11 w-11 items-center justify-center rounded-xl transition-all",
                          "min-h-[44px] min-w-[44px]", // Touch-friendly
                          isSelected
                            ? "bg-primary/20 text-primary ring-2 ring-primary scale-105"
                            : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground active:scale-95"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Type + Schedule */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>{t.typeLabel}</Label>
                <div className="grid grid-cols-2 gap-3">
                  {(["regular", "once"] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setMainFreq(opt)}
                      className={cn(
                        "rounded-xl px-4 py-4 text-sm font-medium transition-all",
                        "min-h-[48px]", // Touch target
                        mainFreq === opt
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "bg-muted text-muted-foreground hover:bg-accent active:scale-95"
                      )}
                    >
                      {opt === "regular" ? t.regular : t.onetime}
                    </button>
                  ))}
                </div>
              </div>

              {/* Schedule block - only for Regular */}
              <div
                className={cn(
                  "space-y-4 overflow-hidden transition-all duration-300",
                  mainFreq === "regular"
                    ? "max-h-[500px] opacity-100"
                    : "max-h-0 opacity-0"
                )}
              >
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                    {t.scheduleLabel}
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {(["daily", "specific"] as const).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setRegularType(opt)}
                        className={cn(
                          "rounded-xl px-4 py-3 text-sm font-medium transition-all",
                          "min-h-[48px]",
                          regularType === opt
                            ? "bg-primary/20 text-primary ring-2 ring-primary"
                            : "bg-muted text-muted-foreground hover:bg-accent active:scale-95"
                        )}
                      >
                        {opt === "daily" ? t.everyDay : t.specificDays}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Weekday selector - only for Specific */}
                <div
                  className={cn(
                    "space-y-3 overflow-hidden transition-all duration-300",
                    regularType === "specific"
                      ? "max-h-[300px] opacity-100"
                      : "max-h-0 opacity-0"
                  )}
                >
                  <p className="text-sm text-muted-foreground">{t.pickDays}</p>
                  <div className="flex gap-2">
                    {WEEKDAYS_EN.map((label, value) => {
                      const isSelected = scheduledDays.includes(value);
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => toggleDay(value)}
                          aria-pressed={isSelected}
                          className={cn(
                            "flex-1 rounded-xl py-3 text-sm font-semibold transition-all",
                            "min-h-[48px]",
                            isSelected
                              ? "bg-primary text-primary-foreground shadow-md"
                              : "bg-muted text-muted-foreground hover:bg-accent active:scale-95"
                          )}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                  {regularType === "specific" && scheduledDays.length === 0 && (
                    <p className="text-xs text-destructive">{t.selectOneDay}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Tags + End Date */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>{t.endDateLabel}</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
                <p className="text-xs text-muted-foreground">
                  {t.endDateHelper}
                </p>
              </div>

              {allAvailableTags.length > 0 && (
                <div className="space-y-3">
                  <Label>{t.tagsLabel}</Label>
                  <div className="flex flex-wrap gap-2">
                    {allAvailableTags.map((tag) => {
                      const active = tagIds.includes(tag.id);
                      const color = getTagColor(tag.id);
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() =>
                            setTagIds((cur) =>
                              cur.includes(tag.id)
                                ? cur.filter((x) => x !== tag.id)
                                : [...cur, tag.id],
                            )
                          }
                          className={cn(
                            "rounded-full px-4 py-3 text-sm font-medium transition-all",
                            "min-h-[44px]", // Touch-friendly
                            "border-2",
                            active
                              ? "text-white shadow-md"
                              : "bg-transparent hover:opacity-80 active:scale-95"
                          )}
                          style={{
                            backgroundColor: active ? color : "transparent",
                            borderColor: color,
                            color: active ? "#ffffff" : color,
                          }}
                        >
                          {tag.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DrawerFooter className="border-t border-border/50 pt-3">
          {currentStep < totalSteps - 1 ? (
            <Button
              onClick={nextStep}
              className="w-full min-h-[48px]"
              disabled={currentStep === 0 && !title.trim()}
            >
              {t.nextBtn}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={save}
              className="w-full min-h-[48px] bg-primary text-primary-foreground"
              disabled={
                mainFreq === "regular" &&
                regularType === "specific" &&
                scheduledDays.length === 0
              }
            >
              {editing ? t.saveBtn : t.createBtn}
            </Button>
          )}
          <DrawerClose className="mx-auto text-sm text-muted-foreground hover:text-foreground hover:underline">
            {t.cancelBtn}
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
