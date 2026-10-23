import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET() { const rows = await prisma.setting.findMany(); return NextResponse.json(Object.fromEntries(rows.map((row: { key: string; value: string }) => [row.key, row.value]))); }
export async function PUT(request: Request) { const data = await request.json() as Record<string, string>; await prisma.$transaction(Object.entries(data).map(([key, value]) => prisma.setting.upsert({ where: { key }, update: { value: String(value) }, create: { key, value: String(value) } }))); return NextResponse.json({ ok: true }); }
