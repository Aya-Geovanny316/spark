"use client";
import type { ThemeId } from "@/lib/themes";
import { themeVisuals } from "@/lib/theme-visuals";
import { useQuemaDiablo } from "./ThemeEngine";

type Props = { theme: ThemeId; category?: string; className?: string };

function Cup({ patriotic }: { patriotic: boolean }) { return <svg viewBox="0 0 64 48" aria-hidden="true"><path d="M12 17h33v14c0 8-6 13-15 13H27c-9 0-15-5-15-13V17Z" fill="none" stroke="currentColor" strokeWidth="2.2"/><path d="M45 21h5c9 0 10 12 2 15l-7 2M7 45h43" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/><path d="M22 11c-3-5 3-7 0-11m10 11c-3-5 3-7 0-11" fill="none" stroke={patriotic ? "#4997D0" : "currentColor"} strokeWidth="2" strokeLinecap="round"/></svg>; }
function Beans() { return <svg viewBox="0 0 64 48" aria-hidden="true"><ellipse cx="23" cy="25" rx="9" ry="15" transform="rotate(-28 23 25)" fill="none" stroke="currentColor" strokeWidth="2.2"/><path d="M18 13c8 7 8 15 4 25M43 27c8 7 8 13 4 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><ellipse cx="45" cy="25" rx="8" ry="13" transform="rotate(27 45 25)" fill="none" stroke="currentColor" strokeWidth="2.2"/></svg>; }
function Flower() { return <svg viewBox="0 0 64 48" aria-hidden="true"><path d="M32 43c0-13 1-21 7-29M32 35c-9-6-16-5-22 1 8 5 15 5 22-1Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><g fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="32" cy="13" r="7"/><circle cx="25" cy="16" r="7"/><circle cx="39" cy="16" r="7"/><circle cx="32" cy="20" r="7"/></g><circle cx="32" cy="17" r="3" fill="currentColor"/></svg>; }
function Glass() { return <svg viewBox="0 0 64 48" aria-hidden="true"><path d="m18 8 5 34h18l5-34H18Z" fill="none" stroke="currentColor" strokeWidth="2.2"/><path d="M20 25h24M25 15h16" stroke="currentColor" strokeWidth="1.6"/><path d="M27 4v7m9-7v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>; }
function Plate() { return <svg viewBox="0 0 64 48" aria-hidden="true"><ellipse cx="32" cy="31" rx="22" ry="8" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M20 29c2-12 22-14 25 0M27 17c4-4 9-4 13 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>; }
function V60() { return <svg viewBox="0 0 64 48" aria-hidden="true"><path d="m18 10 28 0-7 30H25L18 10Z" fill="none" stroke="currentColor" strokeWidth="2.2"/><path d="M23 18h18M25 25h14M28 32h8M32 3v7M27 4h10" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>; }
function Tea() { return <svg viewBox="0 0 64 48" aria-hidden="true"><path d="M14 19h31v12c0 7-6 11-15 11s-16-4-16-11V19Z" fill="none" stroke="currentColor" strokeWidth="2.1"/><path d="M45 23h5c7 0 8 9 2 12h-7M10 45h41" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M24 13c-2-4 3-6 1-10m10 10c-2-4 3-6 1-10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>; }
function Laurel() { return <svg viewBox="0 0 64 48" aria-hidden="true"><path d="M8 39C22 30 29 20 34 7M56 39C42 30 35 20 30 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M16 31c-4-4-8-4-11-1 5 4 8 4 11 1Zm7-7c-4-5-3-8 0-11 4 5 4 8 0 11Zm9-8c-4-5-3-8 0-11 4 5 4 8 0 11Zm16 15c4-4 8-4 11-1-5 4-8 4-11 1Zm-7-7c4-5 3-8 0-11-4 5-4 8 0 11Zm-9-8c4-5 3-8 0-11-4 5-4 8 0 11Z" fill="none" stroke="currentColor" strokeWidth="1.4"/></svg>; }
function Volcano() { return <svg viewBox="0 0 64 48" aria-hidden="true"><path d="M5 40 23 18l8 9 7-17 21 30H5Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M36 10c-3-4 2-6 0-10m8 12c-2-3 2-5 1-8M9 43h47" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>; }
function Ribbon() { return <svg viewBox="0 0 64 48" aria-hidden="true"><path d="M6 12c14 10 27 10 40 0s15-9 12 2c-4 13-18 19-32 14C15 24 9 19 6 12Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M18 16c10 7 19 7 28 1M27 28c7 2 13 1 18-3" fill="none" stroke="#256A9E" strokeWidth="1.5" strokeLinecap="round"/></svg>; }
function WhiteFlower() { return <svg viewBox="0 0 64 48" aria-hidden="true"><path d="M31 43c1-10 3-18 10-27M31 36c-8-4-14-2-18 4 8 3 13 2 18-4Z" fill="none" stroke="#176B4A" strokeWidth="1.8" strokeLinecap="round"/><path d="M41 14c-6-8-2-13 5-14 4 6 2 11-5 14Zm-8 6c-8-5-13-2-13 5 7 3 12 1 13-5Zm8 0c8-5 13-2 13 5-7 3-12 1-13-5Z" fill="#FFFFFF" stroke="#4997D0" strokeWidth="1.5"/></svg>; }

export function CategoryArtwork({ theme, category, className = "" }: Props) {
  const quema = useQuemaDiablo();
  const name = category?.toLowerCase() || "";
  const patriotic = theme === "guatemala";
  const event = theme === "christmas" && quema.active;
  const art = event
    ? name.includes("confianza") ? <Cup patriotic /> : name.includes("metodo") ? <V60 /> : name.includes("frio") ? <Glass /> : name.includes("sin") ? <Tea /> : name.includes("post") ? <Flower /> : <Beans />
    : patriotic
    ? name.includes("confianza") ? <Cup patriotic /> : name.includes("metodo") ? <Volcano /> : name.includes("frio") ? <Ribbon /> : name.includes("sin") ? <WhiteFlower /> : name.includes("post") ? <Flower /> : <Laurel />
    : name.includes("confianza") ? <Cup patriotic={false} /> : name.includes("metodo") ? <V60 /> : name.includes("frio") ? <Glass /> : name.includes("sin") ? <Tea /> : name.includes("post") ? <Plate /> : <Beans />;
  return <span data-decoration-family={event ? "quema-diablo" : themeVisuals[theme].decorationFamily} className={`category-artwork category-artwork-${event ? "quema-diablo" : theme} ${className}`}>{art}</span>;
}

export function ThemeDividerArtwork({ theme }: { theme: ThemeId }) {
  if (theme === "guatemala") return <span className="theme-divider-art theme-divider-art-guatemala" aria-hidden="true"><svg viewBox="0 0 120 28"><path d="M4 14h30m52 0h30M39 14c8-12 13-12 21 0-8 12-13 12-21 0Zm21 0c8-12 13-12 21 0-8 12-13 12-21 0Z"/><path d="M54 5v18M66 5v18"/><circle cx="60" cy="14" r="3"/></svg></span>;
  return <span className="theme-divider-art theme-divider-art-original" aria-hidden="true"><svg viewBox="0 0 120 28"><path d="M4 14h35m42 0h35M42 14c7-9 12-9 18 0-6 9-11 9-18 0Zm18 0c6-9 11-9 18 0-7 9-12 9-18 0Z"/><ellipse cx="60" cy="14" rx="5" ry="8"/><path d="M60 7c3 4 3 9 0 14"/></svg></span>;
}

export function ThemeHeaderArtwork({ theme }: { theme: ThemeId }) {
  const quema = useQuemaDiablo();
  if (theme === "christmas" && quema.active) return <div className="quema-header-art" aria-hidden="true"><span>✦</span><span>⌁</span><span>✧</span><span>⌁</span><span>✦</span></div>;
  if (theme !== "original") return null;
  const patriotic = false;
  return <div className={`theme-header-art theme-header-art-${theme}`} aria-hidden="true"><svg viewBox="0 0 260 72"><path className="header-art-branch" d="M8 61C62 54 101 37 151 10"/><path className="header-art-leaf" d="M53 46c12-11 24-10 34 1-13 7-24 7-34-1Zm40-10c-3-13 4-23 17-28 3 13-3 23-17 28Zm38-10c10-8 21-7 29 1-10 7-20 7-29-1Z"/><ellipse className="header-art-bean" cx="201" cy="36" rx="9" ry="14" transform="rotate(28 201 36)"/><path className="header-art-bean-line" d="M196 25c8 8 8 17 2 24"/>{patriotic && <><path className="header-art-ribbon" d="M174 14c20 7 35 7 54 0v13c-18 7-34 7-54 0Z"/><path className="header-art-flower" d="M215 52c-2-12 3-20 12-25m-12 25c-10-8-18-8-25-1 9 6 17 6 25 1Zm0-13c-8-8-7-16 1-23 7 8 7 16-1 23Z"/></>}</svg></div>;
}
