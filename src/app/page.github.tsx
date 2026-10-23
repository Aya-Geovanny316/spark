import MenuClient from "@/components/menu-client";
import { fallbackCategories, fallbackProducts, fallbackSettings } from "@/lib/menu-data";

export default function GithubPagesHome() {
  return <MenuClient categories={fallbackCategories} products={fallbackProducts} settings={fallbackSettings} />;
}
