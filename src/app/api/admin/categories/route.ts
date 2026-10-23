import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";

const schema = z.object({ name: z.string().min(2), description: z.string().optional(), sortOrder: z.coerce.number().int().default(0), isActive: z.boolean().default(true) });
const slug = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export async function GET() {
  if (!await getAdminSession()) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  return NextResponse.json(await prisma.category.findMany({ include: { _count: { select: { products: true } } }, orderBy: { sortOrder: "asc" } }));
}

export async function POST(request: Request) {
  if (!await getAdminSession()) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  return NextResponse.json(await prisma.category.create({ data: { ...parsed.data, slug: `${slug(parsed.data.name)}-${Date.now()}` } }), { status: 201 });
}
