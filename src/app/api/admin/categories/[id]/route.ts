import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";

const schema = z.object({ name: z.string().min(2).optional(), description: z.string().optional(), imageUrl: z.string().url().optional().or(z.literal("")), sortOrder: z.coerce.number().int().optional(), isActive: z.boolean().optional() });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await getAdminSession()) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await params;
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  return NextResponse.json(await prisma.category.update({ where: { id }, data: { ...parsed.data, imageUrl: parsed.data.imageUrl === undefined ? undefined : parsed.data.imageUrl || null } }));
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await getAdminSession()) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id }, include: { _count: { select: { products: true } } } });
  if (!category) return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 });
  if (category._count.products > 0) return NextResponse.json({ error: "No puedes eliminar una categoría con productos asociados. Desactívala o mueve sus productos primero." }, { status: 409 });
  await prisma.category.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
