import MenuClient from "@/components/menu-client";
import ThemeEngine from "@/components/ThemeEngine";
import { loadMenuData } from "@/lib/menu-server";
import { parseThemeSettings, resolveTheme } from "@/lib/themes";

export const dynamic = "force-dynamic";

export default async function Home() {
  const menu = await loadMenuData();
  const initialTheme = resolveTheme(parseThemeSettings(menu.settings));
  return <ThemeEngine initialTheme={initialTheme} settings={menu.settings}><MenuClient {...menu} theme={initialTheme} /></ThemeEngine>;
}
