"use client";
import type { ThemeId } from "@/lib/themes";
import SeasonalLogo from "./SeasonalLogo";
type Props = { theme: ThemeId };
export default function ThemeDecorations({ theme }: Props) { if (theme === "original") return null; return <div className="seasonal-decorations"><div className="seasonal-logo-overlay"><SeasonalLogo theme={theme} /></div></div>; }
