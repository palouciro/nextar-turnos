import { z } from 'zod';
import { SERVICE_IDS, isRealDate, slotsFor, todayISO, weekdayOf } from '../config/business';

const PHONE_RE = /^\+?\d{8,15}$/;

export const bookingSchema = z
  .object({
    servicio: z
      .array(z.enum(SERVICE_IDS, { errorMap: () => ({ message: 'Elegí un servicio.' }) }))
      .min(1, 'Elegí al menos un servicio.'),
    nombre: z
      .string()
      .trim()
      .min(3, 'Ingresá tu nombre y apellido.')
      .max(80, 'El nombre es demasiado largo.')
      .refine((v) => v.split(/\s+/).length >= 2, 'Ingresá nombre y apellido.'),
    telefono: z
      .string()
      .trim()
      .refine((v) => PHONE_RE.test(v.replace(/[\s\-().]/g, '')), 'Ingresá un teléfono válido (ej: 3476 123456).'),
    email: z.union([z.literal(''), z.string().trim().max(120).email('Ingresá un email válido.')]),
    fecha: z
      .string()
      .min(1, 'Elegí una fecha.')
      .refine(isRealDate, 'Elegí una fecha válida.')
      .refine((d) => d >= todayISO(), 'No podés elegir una fecha pasada.')
      .refine((d) => !isRealDate(d) || weekdayOf(d) !== 0, 'Los domingos no atendemos. Elegí otro día.'),
    horario: z.string().min(1, 'Elegí un horario.'),
    descripcion: z.string().trim().max(500, 'Máximo 500 caracteres.'),
  })
  .superRefine((d, ctx) => {
    if (d.horario && !slotsFor(d.fecha).some((s) => s.id === d.horario)) {
      ctx.addIssue({ code: 'custom', path: ['horario'], message: 'Ese horario no está disponible para la fecha elegida.' });
    }
  });

export type BookingData = z.infer<typeof bookingSchema>;
export type BookingField = keyof BookingData;
export type BookingErrors = Partial<Record<BookingField, string>>;

/** Valores crudos del formulario (todo string, aún sin validar). */
export type BookingValues = {
  servicio: string[];
  nombre: string;
  telefono: string;
  email: string;
  fecha: string;
  horario: string;
  descripcion: string;
};

export const EMPTY_VALUES: BookingValues = {
  servicio: [],
  nombre: '',
  telefono: '',
  email: '',
  fecha: '',
  horario: '',
  descripcion: '',
};

export function validateBooking(values: BookingValues): BookingErrors {
  const result = bookingSchema.safeParse(values);
  if (result.success) return {};
  const errors: BookingErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as BookingField | undefined;
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return errors;
}