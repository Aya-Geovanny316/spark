import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SPARK — Enciende tu día",
  description: "Café de especialidad, momentos memorables.",
  icons: {
    icon: [{ url: "favicon.ico", type: "image/x-icon" }],
  },
  openGraph: {
    title: "SPARK Coffee",
    description: "Menú digital SPARK",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
