// IMPORTANTE: mantener sincronizado con client/src/config/business.ts
// (servicios y franjas horarias). Si cambiás horarios, cambialos en los dos.

export const SERVICE_LABELS = {
  diagnostico: 'Diagnóstico y Análisis de Sistema',
  tecnico: 'Servicio Técnico Especializado',
  seguridad: 'Seguridad Digital y Desinfección',
  armado: 'Armado de PC a Medida',
  componentes: 'Asesoramiento y Gestión de Componentes',
} as const;

export type ServiceId = keyof typeof SERVICE_LABELS;
export const SERVICE_IDS = Object.keys(SERVICE_LABELS) as [ServiceId, ...ServiceId[]];

export interface Slot {
  id: string;
  label: string;
}

const WEEKDAY_SLOTS: readonly Slot[] = [
  { id: '08:30-12:30', label: '8:30 a 12:30 hs' },
  { id: '16:30-19:15', label: '16:30 a 19:15 hs' },
];
const SATURDAY_SLOTS: readonly Slot[] = [{ id: '09:00-12:30', label: '9:00 a 12:30 hs' }];

/** 0 = domingo ... 6 = sábado. Domingo sin atención. */
export const SLOTS_BY_WEEKDAY: Record<number, readonly Slot[]> = {
  0: [],
  1: WEEKDAY_SLOTS,
  2: WEEKDAY_SLOTS,
  3: WEEKDAY_SLOTS,
  4: WEEKDAY_SLOTS,
  5: WEEKDAY_SLOTS,
  6: SATURDAY_SLOTS,
};

const TZ = 'America/Argentina/Buenos_Aires';

/** Fecha de hoy en Argentina, formato YYYY-MM-DD. */
export function todayISO(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

export function isRealDate(iso: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return false;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(Date.UTC(y, mo - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === mo - 1 && date.getUTCDate() === d;
}

export function weekdayOf(iso: string): number {
  const [y, mo, d] = iso.split('-').map(Number) as [number, number, number];
  return new Date(Date.UTC(y, mo - 1, d)).getUTCDay();
}

export function slotsFor(iso: string): readonly Slot[] {
  return SLOTS_BY_WEEKDAY[weekdayOf(iso)] ?? [];
}