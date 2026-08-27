// Copyright (c) 2025 hotflow2024
// Licensed under AGPL-3.0-or-later. See LICENSE for details.
// Commercial licensing available. See COMMERCIAL_LICENSE.md.
import { app } from "electron";
import zh from "../src/i18n/locales/zh.json";
import en from "../src/i18n/locales/en.json";
import vi from "../src/i18n/locales/vi.json";

type AppLanguage = "zh" | "en" | "vi";
type Catalog = Record<string, string>;

const catalogs: Record<AppLanguage, Catalog> = {
  zh: zh as Catalog,
  en: en as Catalog,
  vi: vi as Catalog,
};

let current: AppLanguage = "en";

function normalize(raw: string | undefined | null): AppLanguage | null {
  if (!raw) return null;
  const lower = raw.toLowerCase().replace("_", "-");
  if (lower === "zh" || lower.startsWith("zh-")) return "zh";
  if (lower === "vi" || lower.startsWith("vi-")) return "vi";
  if (lower === "en" || lower.startsWith("en-")) return "en";
  return null;
}

export function detectMainLanguage(): AppLanguage {
  try {
    return normalize(app.getLocale()) ?? "en";
  } catch {
    return "en";
  }
}

export function setMainLanguage(lng: string) {
  current = normalize(lng) ?? detectMainLanguage();
}

export function getMainLanguage(): AppLanguage {
  return current;
}

export function t(key: string, vars?: Record<string, string | number>): string {
  const dict = catalogs[current] || catalogs.en;
  let value = dict[key] || catalogs.en[key] || catalogs.zh[key] || key;
  if (vars) {
    for (const [name, val] of Object.entries(vars)) {
      value = value.replace(new RegExp(`\\{\\{${name}\\}\\}`, "g"), String(val));
    }
  }
  return value;
}

export function initMainI18n() {
  current = detectMainLanguage();
}
