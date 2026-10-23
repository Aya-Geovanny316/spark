import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";

export async function GET() {
  if (!await getAdminSession()) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const rows = await prisma.setting.findMany();
  return NextResponse.json(Object.fromEntries(rows.map(row => [row.key, row.value])));
}

export async function PUT(request: Request) {
  if (!await getAdminSession()) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const data = await request.json() as Record<string, string>;
  await prisma.$transaction(Object.entries(data).map(([key, value]) => prisma.setting.upsert({ where: { key }, update: { value: String(value) }, create: { key, value: String(value) } })));
  return NextResponse.json({ ok: true });
}
