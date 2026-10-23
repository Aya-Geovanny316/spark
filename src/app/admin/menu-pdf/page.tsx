import { loadMenuData } from "@/lib/menu-server";
import MenuPdfClient from "@/components/MenuPdfClient";

export const dynamic = "force-dynamic";

export default async function MenuPdfPage() {
  const menu = await loadMenuData();
  const publicUrl = menu.settings.publicMenuUrl || process.env.NEXT_PUBLIC_MENU_URL || "";
  return <MenuPdfClient {...menu} publicUrl={publicUrl} />;
}
