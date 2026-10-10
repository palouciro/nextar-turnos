import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import express, { type ErrorRequestHandler, type Request, type Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { env } from './config.js';
import { turnoSchema } from './schema.js';
import { buildWaLink, sendTurno } from './whatsapp.js';

// En producción este mismo proceso también sirve el front compilado (client/dist),
// así el deploy es un solo servicio en Render/Railway.
const SERVER_DIR = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_DIST = path.resolve(SERVER_DIR, '../../client/dist');
const HAS_CLIENT = existsSync(CLIENT_DIST);

const app = express();
app.set('trust proxy', 1); // Render/Railway van detrás de un proxy
app.use(helmet());
app.use(cors({ origin: env.corsOrigins, methods: ['GET', 'POST'] }));
app.use(express.json({ limit: '10kb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

const turnosLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos. Probá de nuevo en unos minutos.' },
});

app.post('/api/turnos', turnosLimiter, async (req: Request, res: Response) => {
  const parsed = turnoSchema.safeParse(req.body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form');
      fieldErrors[key] ??= issue.message;
    }
    res.status(400).json({ error: 'Revisá los datos del formulario.', fieldErrors });
    return;
  }

  const turno = parsed.data;
  const id = randomUUID().slice(0, 6).toUpperCase();
  const result = await sendTurno(turno, id);
  const waLink = buildWaLink(turno, id);

  if (result.status === 'fallback' && !waLink) {
    console.error(`[turnos] ${id} no pudo enviarse y no hay WHATSAPP_DESTINO para el fallback.`);
    res.status(503).json({ error: 'No pudimos registrar tu turno en este momento. Probá de nuevo en unos minutos.' });
    return;
  }

  console.log(`[turnos] ${id} servicio=${turno.servicio.join(',')} fecha=${turno.fecha} whatsapp=${result.status}`);
  res.status(201).json({
    ok: true,
    turnoId: id,
    whatsapp: result.status,
    // Solo si la API no pudo enviarlo: el cliente lo manda con un toque.
    waLink: result.status === 'fallback' ? waLink : undefined,
  });
});

// Front compilado (modo producción): sirve estáticos y hace SPA fallback a index.html.
if (HAS_CLIENT) {
  app.use(express.static(CLIENT_DIST, { index: 'index.html', maxAge: '1h' }));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(CLIENT_DIST, 'index.html'));
  });
}

app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada.' });
});

const errorHandler: ErrorRequestHandler = (err: unknown, _req, res, _next) => {
  const status = typeof err === 'object' && err !== null && 'status' in err ? Number((err as { status: unknown }).status) : 500;
  if (status >= 400 && status < 500) {
    res.status(status).json({ error: 'Solicitud inválida.' });
    return;
  }
  console.error('[server] Error inesperado:', err instanceof Error ? err.message : err);
  res.status(500).json({ error: 'Error interno. Probá de nuevo más tarde.' });
};
app.use(errorHandler);

app.listen(env.PORT, () => {
  const wa = env.WHATSAPP_TOKEN && env.WHATSAPP_PHONE_NUMBER_ID && env.WHATSAPP_DESTINO ? 'Cloud API' : 'solo fallback wa.me';
  console.log(`API de turnos en http://localhost:${env.PORT} (WhatsApp: ${wa})`);
});