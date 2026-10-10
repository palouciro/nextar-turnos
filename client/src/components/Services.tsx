import { Activity, Cpu, PackageSearch, ShieldCheck, Wrench, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { SERVICES, type ServiceId } from '../config/business';

const ICONS: Record<ServiceId, LucideIcon> = {
  diagnostico: Activity,
  tecnico: Wrench,
  seguridad: ShieldCheck,
  armado: Cpu,
  componentes: PackageSearch,
};

function ServiceImage({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}

export function Services() {
  return (
    <section id="servicios" className="relative mx-auto max-w-6xl scroll-mt-4 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">Servicios destacados</h2>
        <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-nx-violet-600 to-nx-violet-300" />
      </div>

      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service) => {
          const Icon = ICONS[service.id];
          return (
            <li
              key={service.id}
              className="group overflow-hidden rounded-2xl border border-nx-line bg-nx-panel transition hover:-translate-y-1 hover:border-nx-violet-500/60 hover:shadow-glow"
            >
              <div className="relative flex h-36 items-center justify-center bg-gradient-to-br from-nx-violet-800 via-nx-panel to-nx-ink">
                <Icon className="h-12 w-12 text-nx-violet-300" strokeWidth={1.5} aria-hidden="true" />
                <ServiceImage src={service.image} />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-white">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-nx-silver/75">{service.description}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}