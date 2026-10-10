import { CalendarCheck, Clock, MapPin } from 'lucide-react';
import { BUSINESS, SCHEDULE_DISPLAY } from '../config/business';
import { CircuitBackground } from './CircuitBackground';
import { Logo } from './Logo';

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-nx-line bg-nx-ink">
      {/* Foto opcional: public/img/hero.jpg (si no existe, no se ve nada raro) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-cover bg-center opacity-25"
        style={{ backgroundImage: "url('/img/hero.jpg')" }}
      />
      <CircuitBackground />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 pb-16 pt-12 text-center sm:px-6 sm:pb-24 sm:pt-20">
        <Logo layout="stacked" />

        <h1 className="glow-text mt-10 text-balance text-3xl font-bold leading-tight text-white sm:text-5xl">
          {BUSINESS.tagline}
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-base text-nx-silver/80 sm:text-lg">{BUSINESS.description}</p>

        <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row">
          <a href="#turno" className="btn-primary text-lg">
            <CalendarCheck className="h-5 w-5" aria-hidden="true" />
            Sacar turno
          </a>
          <a href="#servicios" className="btn-ghost text-lg">
            Ver servicios
          </a>
        </div>

        <div className="mt-12 grid w-full max-w-3xl gap-4 text-left sm:grid-cols-2">
          <div className="rounded-2xl border border-nx-line bg-nx-panel/80 p-5 backdrop-blur">
            <div className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-widest text-nx-violet-300">
              <Clock className="h-4 w-4" aria-hidden="true" />
              Nuestros horarios
            </div>
            <dl className="mt-3 space-y-3">
              {SCHEDULE_DISPLAY.map((row) => (
                <div key={row.days}>
                  <dt className="font-display text-base font-semibold text-white">{row.days}</dt>
                  <dd className="text-sm text-nx-silver/80">{row.hours.join(' y ')}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="rounded-2xl border border-nx-line bg-nx-panel/80 p-5 backdrop-blur">
            <div className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-widest text-nx-violet-300">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Dónde estamos
            </div>
            <p className="mt-3 font-display text-base font-semibold text-white">{BUSINESS.location}</p>
            <a
              href={BUSINESS.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sm text-nx-violet-300 underline-offset-4 hover:underline"
            >
              @{BUSINESS.instagram}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}