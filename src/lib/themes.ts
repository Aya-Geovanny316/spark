export type ThemeId = "original" | "halloween" | "christmas" | "valentines" | "guatemala";
export type ThemeMode = "auto" | "manual";
export type ThemeCalendar = { start: string; end: string; priority: number; enabled: boolean };
export type QuemaDiabloSettings = { enabled: boolean; intensity: "off" | "subtle" | "normal" | "festive" };
export type ThemeSettings = { mode: ThemeMode; manualTheme: ThemeId; calendars: Record<Exclude<ThemeId, "original">, ThemeCalendar>; quemaDiablo: QuemaDiabloSettings };

export const themeDefinitions: Record<ThemeId, { name: string; description: string }> = {
  original: { name: "SPARK Original", description: "Minimalismo blanco y negro." },
  halloween: { name: "Halloween", description: "Negro, calabaza y morado oscuro." },
  christmas: { name: "Navidad", description: "Verde pino, vino, crema y dorado." },
  valentines: { name: "San Valentín", description: "Rosa suave, vino y blanco." },
  guatemala: { name: "Mes Patrio · Guatemala", description: "Celeste, blanco y detalles botánicos guatemaltecos." },
};

export const defaultThemeSettings: ThemeSettings = {
  mode: "auto",
  manualTheme: "original",
  calendars: {
    halloween: { start: "10-01", end: "10-31", priority: 30, enabled: true },
    christmas: { start: "12-01", end: "12-31", priority: 30, enabled: true },
    valentines: { start: "02-01", end: "02-14", priority: 30, enabled: true },
    guatemala: { start: "09-01", end: "09-30", priority: 30, enabled: true },
  },
  quemaDiablo: { enabled: true, intensity: "normal" },
};

const themeIds = new Set<ThemeId>(["original", "halloween", "christmas", "valentines", "guatemala"]);
const parseThemeId = (value: string | undefined): ThemeId => themeIds.has(value as ThemeId) ? value as ThemeId : "original";

export function parseThemeSettings(settings: Record<string, string>): ThemeSettings {
  let calendars = defaultThemeSettings.calendars;
  try {
    const parsed = JSON.parse(settings.themeCalendar || "{}");
    calendars = { ...calendars, ...parsed };
  } catch { /* Conserva los calendarios predeterminados si el valor es inválido. */ }
  let quemaDiablo = defaultThemeSettings.quemaDiablo;
  try {
    const parsed = JSON.parse(settings.themeQuemaDiablo || "{}");
    quemaDiablo = { ...quemaDiablo, ...parsed, intensity: ["off", "subtle", "normal", "festive"].includes(parsed.intensity) ? parsed.intensity : quemaDiablo.intensity };
  } catch { /* Mantiene la configuración predeterminada. */ }
  return { mode: settings.themeMode === "manual" ? "manual" : "auto", manualTheme: parseThemeId(settings.themeManual), calendars, quemaDiablo };
}

export function serializeThemeSettings(config: ThemeSettings) {
  return { themeMode: config.mode, themeManual: config.manualTheme, themeCalendar: JSON.stringify(config.calendars), themeQuemaDiablo: JSON.stringify(config.quemaDiablo) };
}

export function getGuatemalaDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Guatemala", month: "2-digit", day: "2-digit" }).formatToParts(now);
  return { month: Number(parts.find(part => part.type === "month")?.value), day: Number(parts.find(part => part.type === "day")?.value) };
}

export function isQuemaDiabloDay(now = new Date()) {
  const { month, day } = getGuatemalaDate(now);
  return month === 12 && day === 7;
}

export function isQuemaDiabloActive(settings: ThemeSettings, now = new Date()) {
  if (!settings.quemaDiablo.enabled || !isQuemaDiabloDay(now)) return false;
  const baseTheme = resolveTheme(settings, now);
  return baseTheme === "christmas";
}

function isInCalendarRange(month: number, day: number, calendar: ThemeCalendar) {
  const [startMonth, startDay] = calendar.start.split("-").map(Number);
  const [endMonth, endDay] = calendar.end.split("-").map(Number);
  const value = month * 100 + day;
  const start = startMonth * 100 + startDay;
  const end = endMonth * 100 + endDay;
  return start <= end ? value >= start && value <= end : value >= start || value <= end;
}

export function resolveTheme(settings: ThemeSettings, now = new Date()): ThemeId {
  if (settings.mode === "manual") return settings.manualTheme;
  const { month, day } = getGuatemalaDate(now);
  const active = (Object.entries(settings.calendars) as [Exclude<ThemeId, "original">, ThemeCalendar][]) .filter(([, calendar]) => calendar.enabled && isInCalendarRange(month, day, calendar)).sort((a, b) => b[1].priority - a[1].priority || a[0].localeCompare(b[0]));
  return active[0]?.[0] || "original";
}
