import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_MENU_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "SPARK Specialty Coffee | Menú",
  description: "Explora el menú de SPARK Specialty Coffee: bebidas, café de especialidad, postres y más.",
  icons: { icon: [{ url: "/favicon.ico", type: "image/x-icon" }] },
  openGraph: { title: "SPARK Specialty Coffee | Menú", description: "Explora el menú de SPARK Specialty Coffee: bebidas, café de especialidad, postres y más.", type: "website", url: siteUrl },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
