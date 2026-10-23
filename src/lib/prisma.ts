import { loadEnvConfig } from "@next/env";
import { PrismaClient } from "@prisma/client";

loadEnvConfig(process.cwd());
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Prisma's Windows query engine cannot negotiate Neon channel binding with
// some Schannel installations. TLS remains required; only the optional
// channel-binding requirement is removed for the runtime connection.
function runtimeDatabaseUrl() {
  const configured = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
  const value = process.platform === "win32"
    ? configured?.replace("-pooler.", ".")
    : process.env.DATABASE_URL;
  if (!value) return value;
  return value
    .replace(/[?&]channel_binding=require&?/i, (match) => match.startsWith("?") ? "?" : "")
    .replace(/[?&]channel_binding=require$/i, "");
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: { db: { url: runtimeDatabaseUrl() } },
});
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
