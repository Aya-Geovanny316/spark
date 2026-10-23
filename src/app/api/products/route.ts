import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET() { const products = await prisma.product.findMany({ where: { isAvailable: true, category: { isActive: true } }, include: { category: true, variants: true }, orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }] }); return NextResponse.json(products); }
