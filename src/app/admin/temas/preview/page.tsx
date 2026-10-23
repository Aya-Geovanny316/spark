import ThemePreviewClient from "@/components/ThemePreviewClient";
import { loadMenuData } from "@/lib/menu-server";
import type { ThemeId } from "@/lib/themes";

export const dynamic = "force-dynamic";
const validThemes = new Set<ThemeId>(["original", "halloween", "christmas", "valentines", "guatemala"]);

export default async function ThemePreviewPage({ searchParams }: { searchParams: Promise<{ theme?: string; event?: string }> }) {
  const params = await searchParams;
  const theme = validThemes.has(params.theme as ThemeId) ? params.theme as ThemeId : "original";
  const menu = await loadMenuData();
  return <ThemePreviewClient {...menu} theme={theme} forceQuemaDiablo={params.event === "quema-diablo"} />;
}
