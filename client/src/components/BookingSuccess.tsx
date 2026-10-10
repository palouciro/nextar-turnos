import { CheckCircle2, MessageCircle } from 'lucide-react';
import { SERVICES, formatLongDate, slotsFor } from '../config/business';
import type { TurnoResponse } from '../lib/api';
import type { BookingData } from '../lib/validation';

interface Props {
  data: BookingData;
  result: TurnoResponse;
  onReset: () => void;
}

export function BookingSuccess({ data, result, onReset }: Props) {
  const selectedServices = SERVICES.filter((s) => data.servicio.includes(s.id));
  const serviceLabel = selectedServices.length > 1 ? 'Servicios' : 'Servicio';
  const slot = slotsFor(data.fecha).find((s) => s.id === data.horario);
  const needsManualSend = result.whatsapp === 'fallback' && Boolean(result.waLink);

  const rows: [string, string][] = [
    [serviceLabel, selectedServices.map((s) => s.title).join(', ')],
    ['Nombre', data.nombre],
    ['Teléfono', data.telefono],
    ...(data.email ? ([['Email', data.email]] as [string, string][]) : []),
    ['Fecha', formatLongDate(data.fecha)],
    ['Horario', slot?.label ?? data.horario],
    ...(data.descripcion ? ([['Detalle', data.descripcion]] as [string, string][]) : []),
  ];

  return (
    <div role="status" aria-live="polite" className="text-slate-900">
      <div className="flex flex-col items-center text-center">
        <CheckCircle2 className="h-14 w-14 text-nx-violet-600" aria-hidden="true" />
        <h3 className="mt-3 text-2xl font-bold">
          {needsManualSend ? '¡Último paso!' : '¡Turno enviado con éxito!'}
        </h3>
        <p className="mt-1 text-slate-600">
          {needsManualSend
            ? 'Tocá el botón para mandarnos el turno por WhatsApp y dejarlo confirmado.'
            : 'Recibimos tu solicitud y te vamos a contactar para confirmarla.'}
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Código de turno: <span className="font-semibold text-slate-800">#{result.turnoId}</span>
        </p>
      </div>

      <dl className="mt-6 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
        {rows.map(([label, value]) => (
          <div key={label} className="grid grid-cols-3 gap-3 px-4 py-3 text-sm">
            <dt className="font-semibold text-slate-500">{label}</dt>
            <dd className="col-span-2 break-words text-slate-900">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        {needsManualSend && result.waLink && (
          <a href={result.waLink} target="_blank" rel="noopener noreferrer" className="btn-primary">
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            Enviar por WhatsApp
          </a>
        )}
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-6 py-3 font-display font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Pedir otro turno
        </button>
      </div>
    </div>
  );
}