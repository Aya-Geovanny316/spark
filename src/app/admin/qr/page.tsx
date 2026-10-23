import QrClient from "@/components/QrClient";
import { loadMenuData } from "@/lib/menu-server";

export const dynamic = "force-dynamic";

export default async function QrPage() {
  const menu = await loadMenuData();
  const url = menu.settings.publicMenuUrl || process.env.NEXT_PUBLIC_MENU_URL || "";
  return <QrClient initialUrl={url} />;
}
