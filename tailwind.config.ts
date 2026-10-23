import type { Config } from "tailwindcss";
const config: Config = { content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"], theme: { extend: { colors: { ink: "#0A0A0A", paper: "#F8F8F8", line: "#E5E5E5", muted: "#888888" }, fontFamily: { sans: ["var(--font-inter)", "sans-serif"] }, boxShadow: { soft: "0 18px 60px rgba(0,0,0,.08)" } } }, plugins: [] };
export default config;
