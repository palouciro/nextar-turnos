import { env } from './config.js';
import type { Turno } from './schema.js';
import { buildPlainMessage, buildTemplateParams } from './whatsappTemplate.js';

export type WhatsAppResult = { status: 'sent' } | { status: 'fallback'; reason: string };

interface GraphError {
  error?: { message?: string; code?: number; error_data?: { details?: string } };
}

/** Envía el turno al negocio con la WhatsApp Cloud API. Nunca lanza: devuelve 'fallback' si algo falla. */
export async function sendTurno(turno: Turno, id: string): Promise<WhatsAppResult> {
  const { WHATSAPP_TOKEN: token, WHATSAPP_PHONE_NUMBER_ID: phoneId, WHATSAPP_DESTINO: to } = env;
  if (!token || !phoneId || !to) {
    return { status: 'fallback', reason: 'whatsapp_no_configurado' };
  }

  const url = `https://graph.facebook.com/${env.GRAPH_API_VERSION}/${phoneId}/messages`;
  const body = {
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: {
      name: env.WHATSAPP_TEMPLATE_NAME,
      language: { code: env.WHATSAPP_TEMPLATE_LANG },
      components: [
        {
          type: 'body',
          parameters: buildTemplateParams(turno, id).map((text) => ({ type: 'text', text })),
        },
      ],
    },
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as GraphError | null;
      const e = data?.error;
      console.error(
        `[whatsapp] Meta respondió ${res.status} (code ${e?.code ?? '?'}): ${e?.message ?? 'sin detalle'} ${e?.error_data?.details ?? ''}`,
      );
      return { status: 'fallback', reason: `meta_${res.status}` };
    }
    return { status: 'sent' };
  } catch (err) {
    const reason = err instanceof Error && err.name === 'AbortError' ? 'timeout' : 'red';
    console.error(`[whatsapp] No se pudo contactar a Meta (${reason}).`);
    return { status: 'fallback', reason };
  } finally {
    clearTimeout(timer);
  }
}

/** Link wa.me con el turno ya escrito, para no perderlo si falla la API. */
export function buildWaLink(turno: Turno, id: string): string | null {
  if (!env.WHATSAPP_DESTINO) return null;
  return `https://wa.me/${env.WHATSAPP_DESTINO}?text=${encodeURIComponent(buildPlainMessage(turno, id))}`;
}