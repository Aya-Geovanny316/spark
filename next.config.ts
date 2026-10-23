import { loadEnvConfig } from "@next/env";
import type { NextConfig } from "next";

loadEnvConfig(process.cwd());

const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  ...(isGithubPages ? { output: "export" as const, basePath: "/spark", trailingSlash: true } : {}),
  images: { unoptimized: isGithubPages, remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }] },
};
export default nextConfig;
