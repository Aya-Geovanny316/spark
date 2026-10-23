import type { ThemeId } from "@/lib/themes";

export default function ThemeDecorations({ theme }: { theme: ThemeId }) {
  if (theme === "original") return null;
  const symbols = theme === "halloween" ? ["✦", "◇", "✦"] : theme === "christmas" ? ["✧", "·", "✦"] : ["♡", "·", "♥"];
  return <div className={`theme-decor theme-decor-${theme}`} aria-hidden="true">{symbols.map((symbol, index) => <span key={`${symbol}-${index}`}>{symbol}</span>)}</div>;
}
