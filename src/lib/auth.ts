import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = { adapter: PrismaAdapter(prisma), session: { strategy: "jwt" }, providers: [CredentialsProvider({ name: "Credenciales", credentials: { email: {}, password: {} }, async authorize(credentials) { if (!credentials?.email || !credentials.password) return null; const user = await prisma.user.findUnique({ where: { email: credentials.email.toLowerCase() } }); if (!user || !(await compare(credentials.password, user.passwordHash))) return null; return { id: user.id, name: user.name, email: user.email, role: user.role }; } })], callbacks: { async jwt({ token, user }) { if (user) token.role = (user as { role?: string }).role; return token; }, async session({ session, token }) { if (session.user) { session.user.id = token.sub ?? ""; session.user.role = token.role as string; } return session; } }, pages: { signIn: "/admin/login" }, secret: process.env.NEXTAUTH_SECRET };
