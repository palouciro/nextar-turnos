import type { BookingData, BookingErrors } from './validation';

export interface TurnoResponse {
  ok: true;
  turnoId: string;
  whatsapp: 'sent' | 'fallback';
  waLink?: string;
}

export class ApiError extends Error {
  fieldErrors: BookingErrors;
  constructor(message: string, fieldErrors: BookingErrors = {}) {
    super(message);
    this.name = 'ApiError';
    this.fieldErrors = fieldErrors;
  }
}

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? '';

export async function crearTurno(data: BookingData): Promise<TurnoResponse> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/api/turnos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch {
    throw new ApiError('No pudimos conectar con el servidor. Revisá tu conexión y probá de nuevo.');
  }

  const json = (await res.json().catch(() => null)) as
    | (Partial<TurnoResponse> & { error?: string; fieldErrors?: BookingErrors })
    | null;

  if (!res.ok || !json?.ok) {
    throw new ApiError(json?.error ?? 'Ocurrió un error al enviar el turno. Probá de nuevo.', json?.fieldErrors ?? {});
  }
  return json as TurnoResponse;
}