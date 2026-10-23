import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
const updateSchema = z.object({ name: z.string().min(2).optional(), description: z.string().min(3).optional(), price: z.coerce.number().nonnegative().optional(), categoryId: z.string().optional(), imageUrl: z.string().url().optional().or(z.literal("")), isAvailable: z.boolean().optional(), isFeatured: z.boolean().optional(), sortOrder: z.coerce.number().int().optional() });
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) { const { id } = await params; const parsed = updateSchema.safeParse(await request.json()); if (!parsed.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 }); return NextResponse.json(await prisma.product.update({ where: { id }, data: { ...parsed.data, imageUrl: parsed.data.imageUrl || null } })); }
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) { const { id } = await params; await prisma.product.delete({ where: { id } }); return new NextResponse(null, { status: 204 }); }
