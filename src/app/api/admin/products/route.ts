import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";

const productSchema = z.object({ name: z.string().min(2), description: z.string().min(3), price: z.coerce.number().nonnegative(), categoryId: z.string().min(1), imageUrl: z.string().url().optional().or(z.literal("")), isAvailable: z.boolean().default(true), isFeatured: z.boolean().default(false), sortOrder: z.coerce.number().int().default(0) });
const slugify = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export async function GET() {
  if (!await getAdminSession()) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  return NextResponse.json(await prisma.product.findMany({ include: { category: true, variants: true }, orderBy: { sortOrder: "asc" } }));
}

export async function POST(request: Request) {
  if (!await getAdminSession()) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const parsed = productSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Datos inválidos", details: parsed.error.flatten() }, { status: 400 });
  const data = parsed.data;
  const product = await prisma.product.create({ data: { ...data, imageUrl: data.imageUrl || null, slug: `${slugify(data.name)}-${Date.now()}`, price: data.price } });
  return NextResponse.json(product, { status: 201 });
}
