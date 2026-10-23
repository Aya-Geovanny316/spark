"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  defaultThemeSettings,
  parseThemeSettings,
  resolveTheme,
  serializeThemeSettings,
  themeDefinitions,
  type ThemeId,
  type ThemeSettings,
} from "@/lib/themes";

const seasonalThemes: Exclude<ThemeId, "original">[] = ["halloween", "christmas", "valentines", "guatemala"];

export default function ThemesPage() {
  const [config, setConfig] = useState<ThemeSettings>(defaultThemeSettings);
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((response) => response.json())
      .then((data) => {
        setConfig(parseThemeSettings(data));
        setLoaded(true);
      });
  }, []);

  async function save(next: ThemeSettings, confirmation: string) {
    if (!window.confirm(confirmation)) return;
    setBusy(true);
    setMessage("");
    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(serializeThemeSettings(next)),
    });
    setBusy(false);
    if (response.ok) {
      setConfig(next);
      setMessage("Configuración guardada y publicada.");
    } else {
      setMessage("No se pudo guardar la configuración.");
    }
  }

  function updateCalendar(theme: Exclude<ThemeId, "original">, field: "start" | "end" | "priority", value: string) {
    setConfig((current) => ({
      ...current,
      calendars: {
        ...current.calendars,
        [theme]: {
          ...current.calendars[theme],
          [field]: field === "priority" ? Number(value) : value,
        },
      },
    }));
  }

  const current = loaded ? resolveTheme(config) : "original";

  return (
    <main className="min-h-screen bg-[#f5f5f3] px-5 py-10 text-[#0a0a0a] md:px-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/admin" className="text-sm text-[#777]">← Dashboard</Link>
        <div className="mt-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs uppercase tracking-[.2em] text-[#888]">Apariencia</p>
            <h1 className="mt-2 text-4xl font-medium tracking-[-.05em]">Temáticas</h1>
            <p className="mt-3 max-w-xl text-sm text-[#777]">Programa temporadas y prueba el menú real sin alterar la vista pública.</p>
          </div>
          <Link href={`/admin/temas/preview?theme=${current}`} className="rounded-full bg-black px-5 py-3 text-sm text-white">Probar temática activa</Link>
        </div>

        <section className="mt-8 rounded-2xl bg-white p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[.16em] text-[#888]">Tema publicado</p>
              <p className="mt-2 text-lg font-medium">{themeDefinitions[current].name}</p>
              <p className="text-sm text-[#777]">Modo {config.mode === "auto" ? "automático" : "manual"} · America/Guatemala</p>
            </div>
            <div className="flex gap-2">
              <button disabled={busy} onClick={() => save({ ...config, mode: "auto" }, "¿Regresar al modo automático?")} className={`rounded-full border px-4 py-2 text-sm ${config.mode === "auto" ? "border-black bg-black text-white" : "border-[#ddd]"}`}>Automático</button>
              <button disabled={busy} onClick={() => save({ ...config, mode: "manual" }, "¿Activar el tema manual seleccionado para todos los visitantes?")} className={`rounded-full border px-4 py-2 text-sm ${config.mode === "manual" ? "border-black bg-black text-white" : "border-[#ddd]"}`}>Manual</button>
            </div>
          </div>
          {message && <p className="mt-4 text-sm text-[#555]">{message}</p>}
        </section>

        <article className="quema-admin-card mt-6 rounded-2xl border border-transparent bg-white p-5 text-[#0a0a0a]">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div><p className="text-xs uppercase tracking-[.16em] text-orange-200">Tema especial · 7 de diciembre</p><h2 className="mt-2 text-2xl font-medium">Quema del Diablo</h2><p className="mt-2 max-w-xl text-sm text-white/75">Tema estático activo únicamente el 7 de diciembre en America/Guatemala. No cambia si publicas otra temática manual.</p></div>
            <label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={config.quemaDiablo.enabled} onChange={(event) => setConfig((current) => ({ ...current, quemaDiablo: { ...current.quemaDiablo, enabled: event.target.checked } }))} className="h-4 w-4 accent-black" /> Activado</label>
          </div>
          <div className="mt-5 flex flex-wrap items-end gap-3">
            <Link href="/admin/temas/preview?theme=christmas&event=quema-diablo" className="rounded-full border border-white/40 px-4 py-2 text-sm">Vista previa</Link>
            <button disabled={busy} onClick={() => save(config, "¿Guardar la configuración de Quema del Diablo?")} className="rounded-full bg-orange-400 px-4 py-2 text-sm font-medium text-[#7f1d1d]">Guardar evento</button>
          </div>
        </article>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <article className={`rounded-2xl border p-5 ${current === "original" ? "border-black" : "border-transparent"} bg-white`}>
            <div className="flex items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-[.16em] text-[#888]">Predeterminado</p><h2 className="mt-2 text-xl font-medium">{themeDefinitions.original.name}</h2><p className="mt-2 text-sm text-[#777]">{themeDefinitions.original.description}</p></div><span className="h-12 w-12 rounded-full bg-black" /></div>
            <div className="mt-6 flex gap-2"><Link href="/admin/temas/preview?theme=original" className="rounded-full border border-[#ddd] px-4 py-2 text-sm">Probar</Link><button disabled={busy} onClick={() => save({ ...config, mode: "manual", manualTheme: "original" }, "¿Publicar SPARK Original?")} className="rounded-full bg-black px-4 py-2 text-sm text-white">Publicar</button></div>
          </article>

          {seasonalThemes.map((theme) => {
            const calendar = config.calendars[theme];
            return <article key={theme} className={`rounded-2xl border p-5 ${current === theme ? "border-black" : "border-transparent"} bg-white`}>
              <div className="flex items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-[.16em] text-[#888]">{current === theme ? "Publicado" : "Temporada"}</p><h2 className="mt-2 text-xl font-medium">{themeDefinitions[theme].name}</h2><p className="mt-2 text-sm text-[#777]">{themeDefinitions[theme].description}</p></div><span className={`h-12 w-12 rounded-full ${theme === "halloween" ? "bg-[#c76a25]" : theme === "christmas" ? "bg-[#17352c]" : theme === "guatemala" ? "bg-[#4997d0]" : "bg-[#a73555]"}`} /></div>
              <div className="mt-5 grid grid-cols-3 gap-2"><label className="text-xs text-[#777]">Inicio<input type="text" inputMode="numeric" value={calendar.start} onChange={(event) => updateCalendar(theme, "start", event.target.value)} className="mt-1 w-full rounded-lg border border-[#ddd] px-2 py-2 text-sm text-black" placeholder="MM-DD" /></label><label className="text-xs text-[#777]">Fin<input type="text" inputMode="numeric" value={calendar.end} onChange={(event) => updateCalendar(theme, "end", event.target.value)} className="mt-1 w-full rounded-lg border border-[#ddd] px-2 py-2 text-sm text-black" placeholder="MM-DD" /></label><label className="text-xs text-[#777]">Prioridad<input type="number" value={calendar.priority} onChange={(event) => updateCalendar(theme, "priority", event.target.value)} className="mt-1 w-full rounded-lg border border-[#ddd] px-2 py-2 text-sm text-black" /></label></div>
              <div className="mt-5 flex flex-wrap gap-2"><Link href={`/admin/temas/preview?theme=${theme}`} className="rounded-full border border-[#ddd] px-4 py-2 text-sm">Probar temática</Link><button disabled={busy} onClick={() => save({ ...config, mode: "manual", manualTheme: theme }, `¿Publicar ${themeDefinitions[theme].name}?`)} className="rounded-full bg-black px-4 py-2 text-sm text-white">Publicar</button></div>
            </article>;
          })}
        </section>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-dashed border-[#bbb] p-5"><p className="text-sm text-[#666]">Restablece fechas y modo automático.</p><button disabled={busy} onClick={() => save(defaultThemeSettings, "¿Restablecer todas las configuraciones de temáticas?")} className="rounded-full border border-[#bbb] px-4 py-2 text-sm">Restablecer valores</button></div>
      </div>
    </main>
  );
}
