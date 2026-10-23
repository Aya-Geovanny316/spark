"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState, type MouseEvent } from "react";

type Props = { children: React.ReactNode; enabled?: boolean; onSingleTap?: () => void };
const duration = 1.42;
const stars = [
  { left: "34%", size: 7, x: -24, y: -54, delay: 0.02, rotate: 18 },
  { left: "44%", size: 5, x: -9, y: -68, delay: 0.08, rotate: -22 },
  { left: "57%", size: 8, x: 17, y: -61, delay: 0.04, rotate: 28 },
  { left: "66%", size: 6, x: 31, y: -45, delay: 0.13, rotate: -16 },
  { left: "50%", size: 5, x: 3, y: -78, delay: 0.16, rotate: 12 },
];

function Star({ size, color = "#fff" }: { size: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true"><path d="M10 0 12 8 20 10 12 12 10 20 8 12 0 10 8 8Z" fill={color} /></svg>;
}

function CompactHeart() {
  return <svg width="42" height="38" viewBox="0 0 34 31" aria-hidden="true">
    <path d="M17 29.2 3.9 16.8C-2.7 10.5 1.6 1.2 9.3 1.2c3.2 0 5.9 1.7 7.7 4.2 1.8-2.5 4.5-4.2 7.7-4.2 7.7 0 12 9.3 5.4 15.6L17 29.2Z" fill="white" stroke="rgba(0,0,0,.18)" strokeWidth=".8" />
    <text x="17" y="16.8" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="7" fontWeight="600" letterSpacing=".5" fill="#111">M.F.</text>
  </svg>;
}

export default function CocoLatteEasterEgg({ children, enabled = true, onSingleTap }: Props) {
  const taps = useRef(0); const lastTap = useRef(0); const hideTimer = useRef<number | null>(null); const resetTimer = useRef<number | null>(null); const singleTapTimer = useRef<number | null>(null);
  const [visible, setVisible] = useState(false); const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => { const query = window.matchMedia("(prefers-reduced-motion: reduce)"); const update = () => setReducedMotion(query.matches); update(); query.addEventListener("change", update); return () => { query.removeEventListener("change", update); if (hideTimer.current) window.clearTimeout(hideTimer.current); if (resetTimer.current) window.clearTimeout(resetTimer.current); if (singleTapTimer.current) window.clearTimeout(singleTapTimer.current); }; }, []);
  function handleTap(event: MouseEvent<HTMLSpanElement>) { event.stopPropagation(); if (!enabled || visible) return; const now = Date.now(); if (now - lastTap.current > 700) taps.current = 0; lastTap.current = now; taps.current += 1; if (singleTapTimer.current) window.clearTimeout(singleTapTimer.current); if (resetTimer.current) window.clearTimeout(resetTimer.current); resetTimer.current = window.setTimeout(() => { taps.current = 0; }, 700); if (taps.current < 3) { singleTapTimer.current = window.setTimeout(() => { if (taps.current < 3) onSingleTap?.(); }, 720); return; } taps.current = 0; setVisible(true); hideTimer.current = window.setTimeout(() => setVisible(false), duration * 1000); }
  return <span className="relative block" onClick={handleTap}>{children}{visible && <span className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 overflow-visible" aria-hidden="true">{stars.map((star, index) => <motion.span key={index} className="absolute bottom-3" style={{ left: star.left }} initial={{ x: 0, y: 8, opacity: 0, rotate: 0 }} animate={reducedMotion ? { opacity: 0.7 } : { x: [0, star.x * 0.6, star.x], y: [8, star.y * 0.48, 10], opacity: [0, 0.9, 0.65, 0], rotate: [0, star.rotate, star.rotate * 1.8] }} transition={reducedMotion ? { duration: 0 } : { duration, delay: star.delay, ease: ["easeOut", "linear", "easeIn"], times: [0, 0.42, 0.78] }}><Star size={star.size} color={index % 2 ? "#e5e5e5" : "#fff"} /></motion.span>)}<motion.span className="absolute bottom-2 left-1/2 -ml-[21px]" initial={{ y: 12, scale: 0.55, opacity: 0, rotate: 0 }} animate={reducedMotion ? { y: 0, scale: 1, opacity: 1 } : { y: [12, -58, 3, 0], scale: [0.55, 1, 1, 0.92], opacity: [0, 1, 1, 0], rotate: [0, -8, 5, 0] }} transition={reducedMotion ? { duration: 0 } : { duration, ease: ["easeOut", "linear", "easeIn"], times: [0, 0.43, 0.82, 1] }}><CompactHeart /></motion.span></span>}</span>;
}
