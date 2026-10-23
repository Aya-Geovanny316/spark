"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { isQuemaDiabloActive, parseThemeSettings, resolveTheme, type ThemeId } from "@/lib/themes";

const ThemeContext = createContext<ThemeId | null>(null);
export type QuemaState = "christmas" | "burning" | "devil-reveal" | "devil-theme";
const QuemaContext = createContext<{ active: boolean; state: QuemaState; animating: boolean; intensity: "off" | "subtle" | "normal" | "festive"; replay: () => void; skip: () => void; advance: (progress: number) => void }>({ active: false, state: "christmas", animating: false, intensity: "off", replay: () => undefined, skip: () => undefined, advance: () => undefined });

export function useTheme(fallback: ThemeId) { return useContext(ThemeContext) || fallback; }
export function useQuemaDiablo() { return useContext(QuemaContext); }

export default function ThemeEngine({ initialTheme, settings, children, lockTheme = false, forceQuemaDiablo = false }: { initialTheme: ThemeId; settings: Record<string, string>; children: ReactNode; lockTheme?: boolean; forceQuemaDiablo?: boolean }) {
  const [theme, setTheme] = useState<ThemeId>(initialTheme);
  const [quema, setQuema] = useState(() => parseThemeSettings(settings).quemaDiablo);
  const [state, setState] = useState<QuemaState>("christmas");
  const [animating, setAnimating] = useState(false);
  useEffect(() => {
    if (lockTheme) return;
    const update = () => { const parsed = parseThemeSettings(settings); setQuema(parsed.quemaDiablo); setTheme(resolveTheme(parsed)); };
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, [lockTheme, settings]);
  const specialActive = (forceQuemaDiablo || isQuemaDiabloActive({ ...parseThemeSettings(settings), quemaDiablo: { ...quema, enabled: quema.enabled || forceQuemaDiablo } })) && theme === "christmas";
  useEffect(() => {
    setState(specialActive ? "devil-theme" : "christmas");
    setAnimating(false);
  }, [specialActive]);
  return <ThemeContext.Provider value={theme}><QuemaContext.Provider value={{ active: specialActive, state, animating: false, intensity: specialActive ? quema.intensity : "off", replay: () => undefined, skip: () => undefined, advance: () => undefined }}>{children}</QuemaContext.Provider></ThemeContext.Provider>;
}
