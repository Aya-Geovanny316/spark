"use client";

import { useEffect, useState } from "react";
import type { ThemeId } from "@/lib/themes";
import { useQuemaDiablo } from "./ThemeEngine";

const logoFiles: Record<ThemeId, string> = {
  original: "spark_logo_original.png",
  halloween: "spark_logo_halloween.png",
  christmas: "spark_logo_navidad.png",
  valentines: "spark_logo_san_valentin.png",
  guatemala: "spark_logo_guatemala.png",
};

export default function SeasonalLogo({ theme, className = "" }: { theme: ThemeId; className?: string }) {
  const quema = useQuemaDiablo();
  const requested = `/images/themes/${theme === "christmas" && quema.active ? "spark_logo_quema_diablo.png" : logoFiles[theme]}`;
  const fallback = "/images/spark_logo_blanco.png";
  const [source, setSource] = useState(requested);
  useEffect(() => setSource(requested), [requested]);
  return <img src={source} onError={() => setSource(fallback)} alt="SPARK Specialty Coffee" className={`h-full w-full object-contain ${className}`} decoding="async" />;
}
