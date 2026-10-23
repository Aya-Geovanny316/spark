"use client";

import MenuClient, { type MenuCategory, type MenuProduct } from "@/components/menu-client";
import { parseThemeSettings, serializeThemeSettings, type ThemeId } from "@/lib/themes";

export default function ThemePreviewClient({ categories, products, settings, theme }: { categories: MenuCategory[]; products: MenuProduct[]; settings: Record<string, string>; theme: ThemeId }) {
  async function publish() {
    if (!window.confirm(`¿Publicar ${theme} para todos los visitantes?`)) return;
    const response = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(serializeThemeSettings({ ...parseThemeSettings(settings), mode: "manual", manualTheme: theme })) });
    if (response.ok) window.location.href = "/admin/temas";
    else window.alert("No se pudo publicar la temática.");
  }
  return <MenuClient categories={categories} products={products} settings={settings} theme={theme} previewMode onPublishTheme={publish} />;
}
