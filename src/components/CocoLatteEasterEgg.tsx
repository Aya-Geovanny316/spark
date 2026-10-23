"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { ThemeId } from "@/lib/themes";

type Props = { children: React.ReactNode; enabled?: boolean; onSingleTap?: () => void; theme?: ThemeId };
const duration = 1.42;
const particles = [
  { left: "34%", size: 7, x: -24, y: -54, delay: .02, rotate: 18 },
  { left: "44%", size: 5, x: -9, y: -68, delay: .08, rotate: -22 },
  { left: "57%", size: 8, x: 17, y: -61, delay: .04, rotate: 28 },
  { left: "66%", size: 6, x: 31, y: -45, delay: .13, rotate: -16 },
  { left: "50%", size: 5, x: 3, y: -78, delay: .16, rotate: 12 },
];
const variants: Record<ThemeId, { heart: string; text: string; colors: string[] }> = {
  original: { heart: "#171717", text: "#fff", colors: ["#fff", "#d6d3d1"] },
  halloween: { heart: "#F97316", text: "#171717", colors: ["#FB923C", "#44245F"] },
  christmas: { heart: "#14532D", text: "#FFF8EC", colors: ["#D4A437", "#B91C1C"] },
  valentines: { heart: "#E75480", text: "#fff", colors: ["#F4A6C1", "#C93B65"] },
  guatemala: { heart: "#4997D0", text: "#fff", colors: ["#DDF1FA", "#176B4A"] },
};
function Particle({ kind, color }: { kind: "star" | "bean" | "snow" | "heart" | "bat"; color: string }) {
  if (kind === "bean") return <svg width="9" height="12" viewBox="0 0 12 16" aria-hidden="true"><ellipse cx="6" cy="8" rx="4.2" ry="6.5" fill={color} transform="rotate(-28 6 8)"/><path d="M3 3c3 3 4 6 2 10" fill="none" stroke="#171717" strokeOpacity=".35" strokeWidth=".8"/></svg>;
  if (kind === "snow") return <svg width="9" height="9" viewBox="0 0 12 12" aria-hidden="true"><path d="M6 0v12M0 6h12M1.7 1.7l8.6 8.6M10.3 1.7 1.7 10.3" stroke={color} strokeWidth="1.3" strokeLinecap="round"/></svg>;
  if (kind === "heart") return <svg width="10" height="9" viewBox="0 0 16 14" aria-hidden="true"><path d="M8 13 1.8 7.1C-1.2 4.2.8 0 4.3 0 6 0 7.1.9 8 2.2 8.9.9 10 0 11.7 0c3.5 0 5.5 4.2 2.5 7.1L8 13Z" fill={color}/></svg>;
  if (kind === "bat") return <svg width="13" height="8" viewBox="0 0 24 14" aria-hidden="true"><path d="M1 4 6 6 10 2l2 4 2-4 4 4 5-2-3 6-5-2-3 3-3-3-5 2L1 4Z" fill={color}/></svg>;
  return <svg width={9} height={9} viewBox="0 0 20 20" aria-hidden="true"><path d="M10 0 12 8 20 10 12 12 10 20 8 12 0 10 8 8Z" fill={color}/></svg>;
}
function CompactHeart({ theme }: { theme: ThemeId }) { const variant = variants[theme]; return <svg width="46" height="42" viewBox="0 0 34 31" aria-hidden="true"><path d="M17 29.2 3.9 16.8C-2.7 10.5 1.6 1.2 9.3 1.2c3.2 0 5.9 1.7 7.7 4.2 1.8-2.5 4.5-4.2 7.7-4.2 7.7 0 12 9.3 5.4 15.6L17 29.2Z" fill={variant.heart} stroke="rgba(0,0,0,.18)" strokeWidth=".8"/><text x="17" y="16.8" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="7" fontWeight="600" letterSpacing=".5" fill={variant.text}>M.F.</text></svg>; }
export default function CocoLatteEasterEgg({ children, enabled = true, onSingleTap, theme = "original" }: Props) {
  const taps = useRef(0), lastTap = useRef(0), hideTimer = useRef<number | null>(null), resetTimer = useRef<number | null>(null), singleTapTimer = useRef<number | null>(null);
  const [visible, setVisible] = useState(false); const [reducedMotion, setReducedMotion] = useState(false);
  const variant = variants[theme];
  const kinds: Array<"star" | "bean" | "snow" | "heart" | "bat"> = theme === "original" ? ["bean", "star", "bean", "star", "star"] : theme === "halloween" ? ["star", "bat", "star", "bat", "star"] : theme === "christmas" ? ["star", "snow", "star", "snow", "star"] : theme === "guatemala" ? ["star", "bean", "star", "star", "bean"] : ["heart", "heart", "star", "heart", "star"];
  useEffect(() => { const query = window.matchMedia("(prefers-reduced-motion: reduce)"), update = () => setReducedMotion(query.matches); update(); query.addEventListener("change", update); return () => { query.removeEventListener("change", update); [hideTimer, resetTimer, singleTapTimer].forEach(timer => { if (timer.current) window.clearTimeout(timer.current); }); }; }, []);
  function handleTap(event: MouseEvent<HTMLSpanElement>) { event.stopPropagation(); if (!enabled || visible) return; const now = Date.now(); if (now - lastTap.current > 700) taps.current = 0; lastTap.current = now; taps.current += 1; if (singleTapTimer.current) window.clearTimeout(singleTapTimer.current); if (resetTimer.current) window.clearTimeout(resetTimer.current); resetTimer.current = window.setTimeout(() => { taps.current = 0; }, 700); if (taps.current < 3) { singleTapTimer.current = window.setTimeout(() => { if (taps.current < 3) onSingleTap?.(); }, 720); return; } taps.current = 0; setVisible(true); hideTimer.current = window.setTimeout(() => setVisible(false), duration * 1000); }
  return <span className="relative block" onClick={handleTap}>{children}{visible && <span className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 overflow-visible" aria-hidden="true">{particles.map((particle, index) => <motion.span key={index} className="absolute bottom-3" style={{ left: particle.left }} initial={{ x: 0, y: 8, opacity: 0, rotate: 0 }} animate={reducedMotion ? { opacity: .7 } : { x: [0, particle.x * .6, particle.x], y: [8, particle.y * .48, 10], opacity: [0, .95, .65, 0], rotate: [0, particle.rotate, particle.rotate * 1.8] }} transition={reducedMotion ? { duration: 0 } : { duration, delay: particle.delay, ease: ["easeOut", "linear", "easeIn"], times: [0, .42, .78] }}><Particle kind={kinds[index]} color={variant.colors[index % variant.colors.length]} /></motion.span>)}<motion.span className="absolute bottom-2 left-1/2 -ml-[23px]" initial={{ y: 12, scale: .55, opacity: 0, rotate: 0 }} animate={reducedMotion ? { y: 0, scale: 1, opacity: 1 } : { y: [12, -58, 3, 0], scale: [.55, 1, 1, .92], opacity: [0, 1, 1, 0], rotate: [0, -8, 5, 0] }} transition={reducedMotion ? { duration: 0 } : { duration, ease: ["easeOut", "linear", "easeIn"], times: [0, .43, .82, 1] }}><CompactHeart theme={theme} /></motion.span></span>}</span>;
}
