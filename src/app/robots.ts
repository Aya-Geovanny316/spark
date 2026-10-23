import type { MetadataRoute } from "next";
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots { const base = process.env.GITHUB_PAGES === "true" ? "https://aya-geovanny316.github.io/spark" : (process.env.NEXT_PUBLIC_MENU_URL || "http://localhost:3000"); return { rules: { userAgent: "*", allow: "/", disallow: "/admin" }, sitemap: `${base}/sitemap.xml` }; }
