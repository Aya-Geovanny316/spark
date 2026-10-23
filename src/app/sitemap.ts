import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap { return [{ url: process.env.NEXT_PUBLIC_MENU_URL || "http://localhost:3000", lastModified: new Date() }]; }
