"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { parseThemeSettings, resolveTheme, type ThemeId } from "@/lib/themes";

const ThemeContext = createContext<ThemeId | null>(null);

export function useTheme(fallback: ThemeId) { return useContext(ThemeContext) || fallback; }

export default function ThemeEngine({ initialTheme, settings, children }: { initialTheme: ThemeId; settings: Record<string, string>; children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeId>(initialTheme);
  useEffect(() => {
    const update = () => setTheme(resolveTheme(parseThemeSettings(settings)));
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, [settings]);
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}
