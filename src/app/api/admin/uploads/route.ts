import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { getSupabaseAdminClient } from "@/lib/supabase";

export const runtime = "nodejs";
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const extensionFor = (type: string) => type === "image/jpeg" ? "jpg" : type.split("/")[1];

export async function POST(request: Request) {
  if (!await getAdminSession()) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Falta el archivo" }, { status: 400 });
  if (!allowedTypes.has(file.type)) return NextResponse.json({ error: "Solo se permiten JPG, PNG o WebP" }, { status: 400 });
  if (file.size > 8 * 1024 * 1024) return NextResponse.json({ error: "La imagen no puede superar 8 MB" }, { status: 400 });
  const path = `products/${crypto.randomUUID()}.${extensionFor(file.type)}`;
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.storage.from(process.env.SUPABASE_STORAGE_BUCKET || "product-images").upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type, upsert: false, cacheControl: "31536000" });
  if (error) return NextResponse.json({ error: "No se pudo guardar la imagen" }, { status: 500 });
  const { data } = supabase.storage.from(process.env.SUPABASE_STORAGE_BUCKET || "product-images").getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
