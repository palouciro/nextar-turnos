// Datos del negocio, servicios y horarios. Todo lo editable está acá.
// IMPORTANTE: servicios y franjas deben coincidir con server/src/schedule.ts

export const BUSINESS = {
  name: 'Nextar Solutions',
  tagline: 'Servicio técnico y desarrollo de sistemas',
  description: 'Servicio Técnico y Desarrollo de Sistemas para PC de Escritorio, Mac y Laptop.',
  location: 'Totoras, Santa Fe, Argentina',
  instagram: 'nextarsolutions',
  instagramUrl: 'https://www.instagram.com/nextarsolutions/',
  /** Si ponés tu logo real en public/img/logo.png, cambiá esto a '/img/logo.png'. */
  logoSrc: null as string | null,
} as const;

export const SERVICES = [
  {
    id: 'diagnostico',
    title: 'Diagnóstico y Análisis de Sistema',
    description:
      'Evaluación exhaustiva del hardware y software para detectar fallas, cuellos de botella o degrado en el rendimiento.',
    image: '/img/servicio-1.jpg',
  },
  {
    id: 'tecnico',
    title: 'Servicio Técnico Especializado',
    description:
      'Reparación, mantenimiento preventivo y correctivo de computadoras de escritorio y notebooks.',
    image: '/img/servicio-2.jpg',
  },
  {
    id: 'seguridad',
    title: 'Seguridad Digital y Desinfección',
    description:
      'Detección y eliminación profunda de virus, malware, spyware y optimización del sistema operativo.',
    image: '/img/servicio-3.jpg',
  },
  {
    id: 'armado',
    title: 'Armado de PC a Medida',
    description:
      'Ensamble profesional desde cero adaptado a tus necesidades y presupuesto (Gaming, Trabajo, Edición o Uso Hogareño).',
    image: '/img/servicio-4.jpg',
  },
  {
    id: 'componentes',
    title: 'Asesoramiento y Gestión de Componentes',
    description:
      'Presupuestación detallada, adquisición e instalación/reemplazo de hardware de última generación (memorias RAM, discos SSD, placas de video, fuentes, etc.).',
    image: '/img/servicio-5.jpg',
  },
] as const;

export type ServiceId = (typeof SERVICES)[number]['id'];
export const SERVICE_IDS = SERVICES.map((s) => s.id) as [ServiceId, ...ServiceId[]];

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

/** Se muestra en la web (tarjeta "Nuestros horarios"). */
export const SCHEDULE_DISPLAY = [
  { days: 'Lunes a viernes', hours: ['8:30 a 12:30 hs', '16:30 a 19:15 hs'] },
  { days: 'Sábados', hours: ['9:00 a 12:30 hs'] },
] as const;

const TZ = 'America/Argentina/Buenos_Aires';

/** Hoy en Argentina como YYYY-MM-DD (no depende de la zona horaria del dispositivo). */
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

/** Franjas disponibles para una fecha (vacío si la fecha es inválida o es domingo). */
export function slotsFor(iso: string): readonly Slot[] {
  return isRealDate(iso) ? (SLOTS_BY_WEEKDAY[weekdayOf(iso)] ?? []) : [];
}

export function formatLongDate(iso: string): string {
  const [y, mo, d] = iso.split('-').map(Number) as [number, number, number];
  return new Intl.DateTimeFormat('es-AR', {
    timeZone: 'UTC',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(Date.UTC(y, mo - 1, d)));
}