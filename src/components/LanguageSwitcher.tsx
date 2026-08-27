// Copyright (c) 2025 hotflow2024
// Licensed under AGPL-3.0-or-later. See LICENSE for details.
// Commercial licensing available. See COMMERCIAL_LICENSE.md.
import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { applyLanguage, t, type LanguagePreference } from "@/i18n";
import { useAppSettingsStore } from "@/stores/app-settings-store";
import { cn } from "@/lib/utils";

const OPTIONS: { value: LanguagePreference; native: string }[] = [
  { value: "system", native: "" },
  { value: "vi", native: "Tiếng Việt" },
  { value: "en", native: "English" },
  { value: "zh", native: "中文" },
];

export function LanguageSwitcher({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const language = useAppSettingsStore((s) => s.language) ?? "system";
  const setLanguage = useAppSettingsStore((s) => s.setLanguage);

  const handleChange = (value: string) => {
    const next = value as LanguagePreference;
    setLanguage(next);
    applyLanguage(next);
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {!compact && (
        <div className="flex items-center gap-2 min-w-0">
          <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-sm font-medium">{t("settings.language")}</span>
        </div>
      )}
      <Select value={language} onValueChange={handleChange}>
        <SelectTrigger
          className={cn(compact ? "h-8 w-[132px] text-xs" : "h-9 w-[180px]")}
          aria-label={t("settings.language")}
        >
          {compact && <Globe className="h-3.5 w-3.5 mr-1 shrink-0" />}
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.value === "system"
                ? t("language.system")
                : `${t(`language.${opt.value}`)}${opt.native ? ` · ${opt.native}` : ""}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
