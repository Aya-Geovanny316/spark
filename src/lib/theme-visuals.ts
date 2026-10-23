import type { ThemeId } from "./themes";

export type DecorationFamily = "coffee-botanical" | "guatemalan-patriotic" | "halloween" | "christmas" | "romantic-floral";

export const themeVisuals: Record<ThemeId, { decorationFamily: DecorationFamily; palette: string[] }> = {
  original: { decorationFamily: "coffee-botanical", palette: ["#171717", "#404040", "#FAF9F6"] },
  guatemala: { decorationFamily: "guatemalan-patriotic", palette: ["#4997D0", "#256A9E", "#FFFFFF", "#176B4A"] },
  halloween: { decorationFamily: "halloween", palette: ["#F97316", "#171717", "#44245F"] },
  christmas: { decorationFamily: "christmas", palette: ["#14532D", "#B91C1C", "#D4A437"] },
  valentines: { decorationFamily: "romantic-floral", palette: ["#F8C8DC", "#E75480", "#C93B65"] },
};
