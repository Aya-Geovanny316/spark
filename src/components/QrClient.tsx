"use client";

import QRCode from "qrcode";
import { useEffect, useMemo, useState } from "react";

const LOGO_SRC = "/images/themes/spark_logo_original.png";
const QR_SIZE = 1200;
const EMPTY_PREVIEW = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
const validUrl = (value: string) => { try { const url = new URL(value); const localPreview = url.protocol === "http:" && /^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/i.test(url.hostname); const productionUrl = url.protocol === "https:" && !/\/admin|deploy-preview|preview-/i.test(value); return localPreview || productionUrl; } catch { return false; } };

type Mode = "qr" | "card";
type Validation = { status: "idle" | "checking" | "verified" | "unsupported" | "failed"; detail: string };

async function imageDataUrl(source: string) { const response = await fetch(source); const blob = await response.blob(); return new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(blob); }); }
async function loadImage(source: string) { return new Promise<HTMLImageElement>((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = source; }); }
function download(source: string, type: string, name: string) { const anchor = document.createElement("a"); anchor.href = source.startsWith("data:") ? source : URL.createObjectURL(new Blob([source], { type })); anchor.download = name; anchor.click(); }

export default function QrClient({ initialUrl }: { initialUrl: string }) {
  const [url, setUrl] = useState(initialUrl || "http://localhost:3000");
  const [withLogo, setWithLogo] = useState(true);
  const [mode, setMode] = useState<Mode>("qr");
  const [logoScale, setLogoScale] = useState(0.15);
  const [preview, setPreview] = useState(EMPTY_PREVIEW);
  const [png, setPng] = useState("");
  const [svg, setSvg] = useState("");
  const [validation, setValidation] = useState<Validation>({ status: "idle", detail: "" });
  const [message, setMessage] = useState("");
  const valid = validUrl(url);
  const local = /^http:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)/i.test(url);
  const protectionScale = Math.min(0.22, logoScale + 0.07);
  const logoLabel = `${Math.round(logoScale * 100)}% visible · ${Math.round(protectionScale * 100)}% protección`;

  const generate = async () => {
    if (!valid) { setPreview(EMPTY_PREVIEW); setPng(""); setSvg(""); setValidation({ status: "idle", detail: "Introduce una URL válida." }); return; }
    setValidation({ status: "checking", detail: "Generando y comprobando la imagen final..." });
    try {
      const logoData = withLogo ? await imageDataUrl(LOGO_SRC) : "";
      const qr = QRCode.create(url, { errorCorrectionLevel: withLogo ? "H" : "M" });
      const modules = qr.modules.size;
      const marginModules = 4;
      const viewSize = modules + marginModules * 2;
      const logoBox = viewSize * protectionScale;
      const logoSize = viewSize * logoScale;
      const start = (viewSize - logoBox) / 2;
      const logoX = (viewSize - logoSize) / 2;
      const baseSvg = await QRCode.toString(url, { type: "svg", errorCorrectionLevel: withLogo ? "H" : "M", margin: marginModules, color: { dark: "#2B211C", light: "#FFFFFF" } });
      const safeSvg = withLogo ? baseSvg.replace("</svg>", `<rect x="${start}" y="${start}" width="${logoBox}" height="${logoBox}" rx="${logoBox * 0.12}" fill="#FFFFFF"/><image href="${logoData}" x="${logoX}" y="${logoX}" width="${logoSize}" height="${logoSize}" preserveAspectRatio="xMidYMid meet"/></svg>`) : baseSvg;
      const qrCanvas = document.createElement("canvas"); qrCanvas.width = QR_SIZE; qrCanvas.height = QR_SIZE; const context = qrCanvas.getContext("2d"); if (!context) throw new Error("canvas");
      const qrImage = await loadImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(safeSvg)}`); context.fillStyle = "#FFFFFF"; context.fillRect(0, 0, QR_SIZE, QR_SIZE); context.imageSmoothingEnabled = false; context.drawImage(qrImage, 0, 0, QR_SIZE, QR_SIZE);
      const finalQr = qrCanvas.toDataURL("image/png");
      let finalPng = finalQr; let finalSvg = safeSvg;
      if (mode === "card") {
        const cardCanvas = document.createElement("canvas"); cardCanvas.width = 1400; cardCanvas.height = 1700; const card = cardCanvas.getContext("2d"); if (!card) throw new Error("canvas"); card.fillStyle = "#FAF7F0"; card.fillRect(0, 0, cardCanvas.width, cardCanvas.height); card.fillStyle = "#2B211C"; card.font = "600 62px Arial"; card.textAlign = "center"; card.fillText("SPARK", 700, 125); card.font = "26px Arial"; card.fillStyle = "#755642"; card.fillText("SPECIALTY COFFEE", 700, 168); const cardQr = await loadImage(finalQr); card.drawImage(cardQr, 100, 250, 1200, 1200); card.fillStyle = "#2B211C"; card.font = "36px Arial"; card.fillText("Escanea para ver nuestro menú", 700, 1535); card.font = "24px Arial"; card.fillStyle = "#755642"; card.fillText("Specialty Coffee", 700, 1580); finalPng = cardCanvas.toDataURL("image/png"); finalSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="1700" viewBox="0 0 1400 1700"><rect width="1400" height="1700" fill="#FAF7F0"/><text x="700" y="125" text-anchor="middle" font-family="Arial" font-size="62" font-weight="600" fill="#2B211C">SPARK</text><text x="700" y="168" text-anchor="middle" font-family="Arial" font-size="26" fill="#755642">SPECIALTY COFFEE</text><g transform="translate(100 250) scale(${1200 / viewSize})">${safeSvg.replace(/^.*?<svg[^>]*>|<\/svg>$/g, "")}</g><text x="700" y="1535" text-anchor="middle" font-family="Arial" font-size="36" fill="#2B211C">Escanea para ver nuestro menú</text><text x="700" y="1580" text-anchor="middle" font-family="Arial" font-size="24" fill="#755642">Specialty Coffee</text></svg>`; }
      setSvg(finalSvg); setPng(finalPng); setPreview(finalPng); await validateFinal(finalPng, url); setMessage(local ? "Muestra local generada. No se guarda como URL pública." : "QR generado con protección blanca y corrección H.");
    } catch { setPreview(EMPTY_PREVIEW); setPng(""); setSvg(""); setValidation({ status: "failed", detail: "No se pudo generar la imagen final." }); }
  };

  async function validateFinal(source: string, expected: string) {
    const Detector = (window as Window & { BarcodeDetector?: new (options?: { formats: string[] }) => { detect(input: CanvasImageSource): Promise<Array<{ rawValue?: string }>> } }).BarcodeDetector;
    if (!Detector) { setValidation({ status: "unsupported", detail: "Imagen final generada. Este navegador no expone un decodificador QR automático." }); return; }
    try { const image = await loadImage(source); const result = document.createElement("canvas"); result.width = image.naturalWidth; result.height = image.naturalHeight; result.getContext("2d")?.drawImage(image, 0, 0); const codes = await new Detector({ formats: ["qr_code"] }).detect(result); const match = codes.some(code => code.rawValue === expected); setValidation(match ? { status: "verified", detail: "Validación final correcta: la imagen con logo devuelve exactamente la URL." } : { status: "failed", detail: "La imagen final no devolvió exactamente la URL. Reduce el tamaño del logo." }); } catch { setValidation({ status: "unsupported", detail: "Imagen final generada. No fue posible decodificarla automáticamente en este navegador." }); }
  }

  useEffect(() => { void generate(); }, [url, withLogo, mode, logoScale]);
  const validationClass = useMemo(() => validation.status === "verified" ? "text-emerald-700" : validation.status === "failed" ? "text-red-700" : "text-[#756b63]", [validation.status]);
  return <main className="min-h-screen bg-[#f5f3ef] px-5 py-10 text-[#2b211c] md:px-10"><div className="mx-auto max-w-6xl"><a href="/admin" className="text-sm text-[#756b63]">← Dashboard</a><div className="mt-8"><p className="text-xs uppercase tracking-[.2em] text-[#8b8177]">Distribución</p><h1 className="mt-2 text-4xl font-medium tracking-[-.05em]">Código QR de SPARK</h1><p className="mt-3 max-w-xl text-sm text-[#756b63]">QR de alto contraste con protección blanca, logo profesional y exportación lista para impresión.</p></div><div className="mt-8 grid gap-6 lg:grid-cols-[1fr_400px]"><section className="rounded-2xl bg-white p-6 shadow-sm"><label className="block text-sm font-medium">URL de destino<input value={url} onChange={event => setUrl(event.target.value)} placeholder="https://tu-dominio.com" className="mt-2 w-full rounded-xl border border-[#ddd5ca] px-4 py-3" /></label><p className={`mt-3 text-xs ${valid ? "text-[#756b63]" : "text-red-700"}`}>{valid ? local ? "Muestra local permitida únicamente para pruebas." : "URL HTTPS válida para producción." : "Usa una URL HTTPS pública. No se permiten rutas administrativas ni previews."}</p><label className="mt-5 flex items-center gap-3 text-sm"><input type="checkbox" checked={withLogo} onChange={event => setWithLogo(event.target.checked)} className="h-4 w-4 accent-[#2b211c]" />Logo SPARK en el centro</label><label className="mt-5 block text-sm">Presentación<select value={mode} onChange={event => setMode(event.target.value as Mode)} className="mt-2 w-full rounded-xl border border-[#ddd5ca] bg-white px-3 py-3"><option value="qr">QR limpio con logo</option><option value="card">Tarjeta lista para impresión</option></select></label>{withLogo && <label className="mt-5 block text-sm">Tamaño del logo: <span className="text-[#756b63]">{logoLabel}</span><input type="range" min="0.11" max="0.18" step="0.01" value={logoScale} onChange={event => setLogoScale(Number(event.target.value))} className="mt-3 w-full accent-[#2b211c]" /></label>}<div className="mt-6 flex flex-wrap gap-2"><button onClick={() => void generate()} className="rounded-full bg-[#2b211c] px-4 py-2 text-sm text-white">Regenerar</button><button onClick={() => void saveUrl()} disabled={!valid || local} className="rounded-full border border-[#2b211c] px-4 py-2 text-sm disabled:opacity-40">Guardar URL</button><button onClick={() => valid && window.open(url, "_blank", "noopener,noreferrer")} disabled={!valid || local} className="rounded-full border border-[#ddd5ca] px-4 py-2 text-sm disabled:opacity-40">Probar enlace</button></div>{validation.detail && <p className={`mt-5 text-sm ${validationClass}`}>{validation.status === "checking" ? "⏳ " : validation.status === "verified" ? "✓ " : ""}{validation.detail}</p>}{message && <p className="mt-2 text-xs text-[#756b63]">{message}</p>}</section><section className="rounded-2xl bg-[#ded8cf] p-5"><div className="rounded-xl bg-white p-5 shadow-sm"><img src={preview} alt="Vista previa del código QR de SPARK" className="mx-auto aspect-square w-full max-w-[360px] object-contain" />{!preview && <p className="py-20 text-center text-sm text-[#756b63]">Generando vista previa...</p>}<p className="mt-4 break-all text-center text-xs text-[#756b63]">{url}</p><div className="mt-5 grid grid-cols-2 gap-2"><button disabled={!png} onClick={() => download(png, "image/png", mode === "card" ? "spark-qr-tarjeta.png" : "spark-qr-logo.png")} className="rounded-full bg-[#2b211c] px-3 py-2 text-sm text-white disabled:opacity-40">Descargar PNG</button><button disabled={!svg} onClick={() => download(svg, "image/svg+xml", mode === "card" ? "spark-qr-tarjeta.svg" : "spark-qr-logo.svg")} className="rounded-full border border-[#2b211c] px-3 py-2 text-sm disabled:opacity-40">Descargar SVG</button></div></div></section></div></div></main>;

  async function saveUrl() { const response = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ publicMenuUrl: url }) }); setMessage(response.ok ? "URL pública guardada." : "No se pudo guardar la URL."); }
}
