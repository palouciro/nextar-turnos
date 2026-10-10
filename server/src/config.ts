import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3001),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
  WHATSAPP_TOKEN: z.string().optional(),
  WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),
  WHATSAPP_DESTINO: z
    .string()
    .optional()
    .transform((v) => (v ? v.replace(/\D/g, '') : undefined)),
  WHATSAPP_TEMPLATE_NAME: z.string().default('nuevo_turno'),
  WHATSAPP_TEMPLATE_LANG: z.string().default('es_AR'),
  GRAPH_API_VERSION: z.string().default('v21.0'),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Variables de entorno inválidas:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = {
  ...parsed.data,
  // Los strings vacíos de .env.example cuentan como "no configurado"
  WHATSAPP_TOKEN: parsed.data.WHATSAPP_TOKEN || undefined,
  WHATSAPP_PHONE_NUMBER_ID: parsed.data.WHATSAPP_PHONE_NUMBER_ID || undefined,
  WHATSAPP_DESTINO: parsed.data.WHATSAPP_DESTINO || undefined,
  corsOrigins: parsed.data.CLIENT_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean),
};