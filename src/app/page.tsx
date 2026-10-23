import { prisma } from "@/lib/prisma";
import MenuClient, { type MenuCategory, type MenuProduct } from "@/components/menu-client";
import { fallbackCategories, fallbackProducts, fallbackSettings } from "@/lib/menu-data";

export const dynamic = "force-dynamic";
export default async function Home() {
  try {
    const [categories, rows, settings] = await Promise.all([prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }), prisma.product.findMany({ where: { isAvailable: true, category: { isActive: true } }, include: { category: true, variants: { where: { isAvailable: true }, orderBy: { sortOrder: "asc" } } }, orderBy: { sortOrder: "asc" } }), prisma.setting.findMany()]);
    const settingMap = { ...fallbackSettings, ...Object.fromEntries(settings.map(item => [item.key, item.value])) };
    const menuCategories: MenuCategory[] = categories.map(category => ({ id: category.slug, name: category.name }));
    const products: MenuProduct[] = rows.map(product => ({ id: product.slug, name: product.name, description: product.description, price: Number(product.price), category: product.category.slug, image: product.imageUrl || "/images/product-placeholder.svg", variants: product.variants.map(variant => ({ name: variant.name, price: Number(variant.price) })) }));
    return <MenuClient categories={menuCategories.length ? menuCategories : fallbackCategories} products={products.length ? products : fallbackProducts} settings={settingMap} />;
  } catch {
    return <MenuClient categories={fallbackCategories} products={fallbackProducts} settings={fallbackSettings} />;
  }
}
