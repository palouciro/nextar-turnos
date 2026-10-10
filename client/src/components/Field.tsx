import type { ReactNode } from 'react';

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string | undefined;
  hint?: string;
  children: ReactNode;
}

export function Field({ id, label, required, error, hint, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-slate-800">
        {label}
        {required ? (
          <span className="text-nx-violet-600" aria-hidden="true">
            {' '}
            *
          </span>
        ) : (
          <span className="font-normal text-slate-500"> (opcional)</span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-slate-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

/** Clases compartidas de inputs sobre la tarjeta clara. */
export function inputClass(hasError: boolean): string {
  return [
    'block w-full rounded-xl border bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 transition',
    'focus-visible:border-nx-violet-600 focus-visible:ring-2 focus-visible:ring-nx-violet-500 focus-visible:ring-offset-0',
    'disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400',
    hasError ? 'border-red-500' : 'border-slate-300',
  ].join(' ');
}

/** Atributos ARIA comunes para vincular error/pista con el input. */
export function ariaFor(id: string, error: string | undefined, hasHint: boolean) {
  return {
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? `${id}-error` : hasHint ? `${id}-hint` : undefined,
  } as const;
}