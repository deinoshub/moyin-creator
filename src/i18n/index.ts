// Copyright (c) 2025 hotflow2024
// Licensed under AGPL-3.0-or-later. See LICENSE for details.
// Commercial licensing available. See COMMERCIAL_LICENSE.md.
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import zh from "./locales/zh.json";
import en from "./locales/en.json";
import vi from "./locales/vi.json";

export const SUPPORTED_LANGUAGES = ["zh", "en", "vi"] as const;
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];
export type LanguagePreference = "system" | AppLanguage;

export const LANGUAGE_LABELS: Record<LanguagePreference, string> = {
  system: "language.system",
  zh: "language.zh",
  en: "language.en",
  vi: "language.vi",
};

export const DATE_LOCALES: Record<AppLanguage, string> = {
  zh: "zh-CN",
  en: "en-US",
  vi: "vi-VN",
};

const STORAGE_KEY = "moyin-language";

function normalizeLanguage(raw: string | undefined | null): AppLanguage | null {
  if (!raw) return null;
  const lower = raw.toLowerCase().replace("_", "-");
  if (lower === "zh" || lower.startsWith("zh-")) return "zh";
  if (lower === "vi" || lower.startsWith("vi-")) return "vi";
  if (lower === "en" || lower.startsWith("en-")) return "en";
  return null;
}

export function detectOSLanguage(): AppLanguage {
  if (typeof navigator !== "undefined") {
    const candidates = [
      navigator.language,
      ...(navigator.languages || []),
    ];
    for (const candidate of candidates) {
      const mapped = normalizeLanguage(candidate);
      if (mapped) return mapped;
    }
  }
  return "en";
}

export function readStoredPreference(): LanguagePreference {
  if (typeof localStorage === "undefined") return "system";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "system" || stored === "zh" || stored === "en" || stored === "vi") {
      return stored;
    }
  } catch {
    // ignore
  }
  return "system";
}

export function resolveLanguage(preference: LanguagePreference): AppLanguage {
  if (preference === "system") return detectOSLanguage();
  return preference;
}

i18n.use(initReactI18next).init({
  resources: {
    zh: { translation: zh },
    en: { translation: en },
    vi: { translation: vi },
  },
  lng: resolveLanguage(readStoredPreference()),
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  keySeparator: false,
  nsSeparator: false,
  returnNull: false,
  returnEmptyString: false,
  parseMissingKeyHandler: (key) => key,
});

export function t(key: string, options?: Record<string, unknown>): string {
  if (!key) return "";
  return String(i18n.t(key, options));
}

export function getDateLocale(): string {
  const lng = (i18n.language || "en") as AppLanguage;
  return DATE_LOCALES[lng] || DATE_LOCALES.en;
}

function applyDocumentLanguage(lng: AppLanguage) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = lng === "zh" ? "zh-CN" : lng;
  const title = t("app.title");
  if (title && title !== "app.title") {
    document.title = title;
  }
}

export function applyLanguage(preference: LanguagePreference): AppLanguage {
  const lng = resolveLanguage(preference);
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, preference);
    } catch {
      // ignore
    }
  }
  if (i18n.language !== lng) {
    void i18n.changeLanguage(lng);
  }
  applyDocumentLanguage(lng);
  if (typeof window !== "undefined") {
    window.ipcRenderer?.send("app-set-language", lng);
  }
  return lng;
}

applyDocumentLanguage(resolveLanguage(readStoredPreference()));

export default i18n;
