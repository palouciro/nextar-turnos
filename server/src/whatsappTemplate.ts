import { SERVICE_LABELS, slotsFor } from './schedule.js';
import type { Turno } from './schema.js';

/*
 * ───────────────────────────────────────────────────────────────────────────
 *  TEMPLATE DE WHATSAPP (requisito de Meta)
 * ───────────────────────────────────────────────────────────────────────────
 *  Los mensajes que inicia el negocio SOLO se pueden enviar con un template
 *  aprobado por Meta. Pasos:
 *   1. business.facebook.com > WhatsApp Manager > Plantillas de mensaje > Crear.
 *   2. Categoría: Utilidad. Nombre: el de WHATSAPP_TEMPLATE_NAME (ej. nuevo_turno).
 *      Idioma: Español (Argentina) → es_AR.
 *   3. Cuerpo EXACTO (8 variables, en este orden):
 *
 *      📅 Nuevo turno #{{1}}
 *      Servicio: {{2}}
 *      Cliente: {{3}}
 *      WhatsApp: {{4}}
 *      Email: {{5}}
 *      Fecha: {{6}}
 *      Horario: {{7}}
 *      Detalle: {{8}}
 *
 *   4. Enviar a revisión. Hasta que no esté "Aprobada", la API rechaza el envío
 *      y el servidor usa el fallback wa.me (el cliente toca un botón y te escribe).
 *
 *  Si cambiás el texto del template en Meta, actualizá TEMPLATE_PARAM_ORDER.
 *  Meta NO permite saltos de línea, tabs ni 4+ espacios seguidos dentro de una variable.
 * ───────────────────────────────────────────────────────────────────────────
 */

export const TEMPLATE_PARAM_ORDER = [
  'id',
  'servicio',
  'nombre',
  'telefono',
  'email',
  'fecha',
  'horario',
  'descripcion',
] as const;

function slotLabel(turno: Turno): string {
  return slotsFor(turno.fecha).find((s) => s.id === turno.horario)?.label ?? turno.horario;
}

function formatFecha(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

/** Limpia un valor para que Meta lo acepte como variable de template. */
function sanitizeParam(value: string): string {
  const clean = value.replace(/[\r\n\t]+/g, ' ').replace(/ {2,}/g, ' ').trim();
  return (clean || '-').slice(0, 900);
}

export function buildTemplateParams(turno: Turno, id: string): string[] {
  const values: Record<(typeof TEMPLATE_PARAM_ORDER)[number], string> = {
    id,
    servicio: SERVICE_LABELS[turno.servicio],
    nombre: turno.nombre,
    telefono: turno.telefono,
    email: turno.email,
    fecha: formatFecha(turno.fecha),
    horario: slotLabel(turno),
    descripcion: turno.descripcion,
  };
  return TEMPLATE_PARAM_ORDER.map((k) => sanitizeParam(values[k]));
}

/** Texto libre para el fallback wa.me (acá sí se permiten saltos de línea). */
export function buildPlainMessage(turno: Turno, id: string): string {
  return [
    `📅 Nuevo turno #${id}`,
    `Servicio: ${SERVICE_LABELS[turno.servicio]}`,
    `Cliente: ${turno.nombre}`,
    `WhatsApp: ${turno.telefono}`,
    `Email: ${turno.email || '-'}`,
    `Fecha: ${formatFecha(turno.fecha)}`,
    `Horario: ${slotLabel(turno)}`,
    `Detalle: ${turno.descripcion || '-'}`,
  ].join('\n');
}