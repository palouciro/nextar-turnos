import { Loader2, Send } from 'lucide-react';
import { useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { SERVICES, slotsFor, todayISO } from '../config/business';
import { ApiError, crearTurno, type TurnoResponse } from '../lib/api';
import {
  EMPTY_VALUES,
  bookingSchema,
  validateBooking,
  type BookingData,
  type BookingErrors,
  type BookingField,
  type BookingValues,
} from '../lib/validation';
import { BookingSuccess } from './BookingSuccess';
import { Field, ariaFor, inputClass } from './Field';

const FIELD_ORDER: BookingField[] = ['servicio', 'nombre', 'telefono', 'email', 'fecha', 'horario', 'descripcion'];
const MAX_DESC = 500;

export function BookingForm() {
  const [values, setValues] = useState<BookingValues>(EMPTY_VALUES);
  const [touched, setTouched] = useState<Partial<Record<BookingField, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverFieldErrors, setServerFieldErrors] = useState<BookingErrors>({});
  const [done, setDone] = useState<{ data: BookingData; result: TurnoResponse } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const allErrors = useMemo(() => validateBooking(values), [values]);
  const slots = useMemo(() => slotsFor(values.fecha), [values.fecha]);

  const errorFor = (field: BookingField): string | undefined =>
    touched[field] || submitted ? (allErrors[field] ?? serverFieldErrors[field]) : serverFieldErrors[field];

  const setField = (field: BookingField, value: string) => {
    setValues((prev) => {
      const next = { ...prev, [field]: value };
      // Si cambia la fecha y el horario elegido ya no existe ese día, se limpia.
      if (field === 'fecha' && !slotsFor(value).some((s) => s.id === prev.horario)) next.horario = '';
      return next;
    });
    setServerFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    setServerError(null);
  };

  const onText =
    (field: BookingField) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setField(field, e.target.value);
  const onBlur = (field: BookingField) => () => setTouched((prev) => ({ ...prev, [field]: true }));

  const reset = () => {
    setValues(EMPTY_VALUES);
    setTouched({});
    setSubmitted(false);
    setServerError(null);
    setServerFieldErrors({});
    setDone(null);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitted(true);

    const parsed = bookingSchema.safeParse(values);
    if (!parsed.success) {
      const firstInvalid = FIELD_ORDER.find((f) => allErrors[f]);
      if (firstInvalid) {
        const target =
          firstInvalid === 'servicio'
            ? formRef.current?.querySelector<HTMLElement>('input[name="servicio"]')
            : formRef.current?.querySelector<HTMLElement>(`#${firstInvalid}`);
        target?.focus();
      }
      return;
    }

    setSubmitting(true);
    setServerError(null);
    try {
      const result = await crearTurno(parsed.data);
      setDone({ data: parsed.data, result });
      document.getElementById('turno')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
      if (err instanceof ApiError) {
        setServerError(err.message);
        setServerFieldErrors(err.fieldErrors);
      } else {
        setServerError('Ocurrió un error inesperado. Probá de nuevo.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return <BookingSuccess data={done.data} result={done.result} onReset={reset} />;
  }

  const servicioError = errorFor('servicio');
  const fechaError = errorFor('fecha');
  const horarioError = errorFor('horario');
  const descError = errorFor('descripcion');
  const dateChosen = Boolean(values.fecha) && !allErrors.fecha;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-6 text-slate-900">
      <fieldset aria-describedby={servicioError ? 'servicio-error' : undefined}>
        <legend className="mb-2 text-sm font-semibold text-slate-800">
          Servicio{' '}
          <span className="text-nx-violet-600" aria-hidden="true">
            *
          </span>
        </legend>
        <div className="grid gap-2">
          {SERVICES.map((s) => {
            const checked = values.servicio === s.id;
            return (
              <label key={s.id} className="relative block cursor-pointer">
                <input
                  type="radio"
                  name="servicio"
                  value={s.id}
                  checked={checked}
                  onChange={onText('servicio')}
                  onBlur={onBlur('servicio')}
                  required
                  className="peer sr-only"
                />
                <span
                  className={[
                    'flex items-center gap-3 rounded-xl border bg-white px-4 py-3 text-sm font-medium text-slate-800 transition',
                    'peer-checked:border-nx-violet-600 peer-checked:bg-nx-violet-300/20 peer-checked:ring-1 peer-checked:ring-nx-violet-600',
                    'peer-focus-visible:ring-2 peer-focus-visible:ring-nx-violet-500',
                    servicioError ? 'border-red-500' : 'border-slate-300 hover:border-nx-violet-400',
                  ].join(' ')}
                >
                  <span
                    aria-hidden="true"
                    className={[
                      'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
                      checked ? 'border-nx-violet-600' : 'border-slate-400',
                    ].join(' ')}
                  >
                    {checked && <span className="h-2.5 w-2.5 rounded-full bg-nx-violet-600" />}
                  </span>
                  {s.title}
                </span>
              </label>
            );
          })}
        </div>
        {servicioError && (
          <p id="servicio-error" role="alert" className="mt-1 text-sm font-medium text-red-700">
            {servicioError}
          </p>
        )}
      </fieldset>

      <Field id="nombre" label="Nombre y apellido" required error={errorFor('nombre')}>
        <input
          id="nombre"
          name="nombre"
          type="text"
          autoComplete="name"
          value={values.nombre}
          onChange={onText('nombre')}
          onBlur={onBlur('nombre')}
          maxLength={80}
          className={inputClass(Boolean(errorFor('nombre')))}
          {...ariaFor('nombre', errorFor('nombre'), false)}
        />
      </Field>

      <Field id="telefono" label="Teléfono / WhatsApp" required error={errorFor('telefono')} hint="Con código de área, sin 0 ni 15.">
        <input
          id="telefono"
          name="telefono"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="3476 123456"
          value={values.telefono}
          onChange={onText('telefono')}
          onBlur={onBlur('telefono')}
          className={inputClass(Boolean(errorFor('telefono')))}
          {...ariaFor('telefono', errorFor('telefono'), true)}
        />
      </Field>

      <Field id="email" label="Email" error={errorFor('email')}>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={values.email}
          onChange={onText('email')}
          onBlur={onBlur('email')}
          className={inputClass(Boolean(errorFor('email')))}
          {...ariaFor('email', errorFor('email'), false)}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="fecha" label="Fecha del turno" required error={fechaError} hint="Atendemos de lunes a sábado.">
          <input
            id="fecha"
            name="fecha"
            type="date"
            min={todayISO()}
            value={values.fecha}
            onChange={onText('fecha')}
            onBlur={onBlur('fecha')}
            className={inputClass(Boolean(fechaError)) + ' [color-scheme:light]'}
            {...ariaFor('fecha', fechaError, true)}
          />
        </Field>

        <Field
          id="horario"
          label="Horario"
          required
          error={horarioError}
          hint={dateChosen ? undefined : 'Primero elegí una fecha.'}
        >
          <select
            id="horario"
            name="horario"
            value={values.horario}
            onChange={onText('horario')}
            onBlur={onBlur('horario')}
            disabled={!dateChosen || slots.length === 0}
            className={inputClass(Boolean(horarioError))}
            {...ariaFor('horario', horarioError, !dateChosen)}
          >
            <option value="">Elegí una franja…</option>
            {slots.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field id="descripcion" label="Descripción del problema" error={descError}>
        <textarea
          id="descripcion"
          name="descripcion"
          rows={4}
          maxLength={MAX_DESC + 50}
          value={values.descripcion}
          onChange={onText('descripcion')}
          onBlur={onBlur('descripcion')}
          placeholder="Contanos qué le pasa a tu equipo (opcional)"
          className={inputClass(Boolean(descError))}
          {...ariaFor('descripcion', descError, false)}
        />
        <p className={`mt-1 text-right text-xs ${values.descripcion.length > MAX_DESC ? 'text-red-700' : 'text-slate-500'}`}>
          {values.descripcion.length}/{MAX_DESC}
        </p>
      </Field>

      {serverError && (
        <p role="alert" className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {serverError}
        </p>
      )}

      <button type="submit" disabled={submitting} className="btn-primary w-full text-lg">
        {submitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            Enviando…
          </>
        ) : (
          <>
            <Send className="h-5 w-5" aria-hidden="true" />
            Solicitar turno
          </>
        )}
      </button>
    </form>
  );
}