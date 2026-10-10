import { z } from 'zod';
import { SERVICE_IDS, isRealDate, slotsFor, todayISO, weekdayOf } from './schedule.js';

const PHONE_RE = /^\+?\d{8,15}$/;

export const turnoSchema = z
  .object({
    servicio: z
      .array(z.enum(SERVICE_IDS, { errorMap: () => ({ message: 'Elegí un servicio.' }) }))
      .min(1, 'Elegí al menos un servicio.'),
    nombre: z
      .string({ required_error: 'Ingresá tu nombre y apellido.' })
      .trim()
      .min(3, 'Ingresá tu nombre y apellido.')
      .max(80, 'El nombre es demasiado largo.')
      .refine((v) => v.split(/\s+/).length >= 2, 'Ingresá nombre y apellido.'),
    telefono: z
      .string({ required_error: 'Ingresá tu teléfono.' })
      .trim()
      .refine((v) => PHONE_RE.test(v.replace(/[\s\-().]/g, '')), 'Ingresá un teléfono válido (ej: 3476 123456).'),
    email: z.union([z.literal(''), z.string().trim().max(120).email('Ingresá un email válido.')]).default(''),
    fecha: z
      .string({ required_error: 'Elegí una fecha.' })
      .refine(isRealDate, 'Elegí una fecha válida.')
      .refine((d) => d >= todayISO(), 'No podés elegir una fecha pasada.')
      .refine((d) => !isRealDate(d) || weekdayOf(d) !== 0, 'Los domingos no atendemos. Elegí otro día.'),
    horario: z.string({ required_error: 'Elegí un horario.' }).min(1, 'Elegí un horario.'),
    descripcion: z.string().trim().max(500, 'Máximo 500 caracteres.').default(''),
  })
  .superRefine((d, ctx) => {
    if (!slotsFor(d.fecha).some((s) => s.id === d.horario)) {
      ctx.addIssue({ code: 'custom', path: ['horario'], message: 'Ese horario no está disponible para la fecha elegida.' });
    }
  });

export type Turno = z.infer<typeof turnoSchema>;