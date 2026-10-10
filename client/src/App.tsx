import { Instagram, MapPin } from 'lucide-react';
import { BookingForm } from './components/BookingForm';
import { Hero } from './components/Hero';
import { Logo } from './components/Logo';
import { Services } from './components/Services';
import { BUSINESS } from './config/business';

export default function App() {
  return (
    <div className="min-h-screen">
      <a
        href="#turno"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-nx-ink"
      >
        Ir al formulario de turno
      </a>

      <header className="sticky top-0 z-40 border-b border-nx-line bg-nx-night/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Logo />
          <a href="#turno" className="btn-primary px-4 py-2 text-sm">
            Sacar turno
          </a>
        </div>
      </header>

      <main>
        <Hero />
        <Services />

        <section id="turno" className="relative scroll-mt-16 px-4 pb-20 sm:px-6 sm:pb-28">
          <div className="mx-auto max-w-2xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">Sacá tu turno</h2>
              <p className="mt-3 text-nx-silver/75">Completá tus datos y te contactamos por WhatsApp para confirmarlo.</p>
            </div>
            <div className="mt-8 rounded-3xl bg-nx-paper p-5 shadow-glow sm:p-8">
              <BookingForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-nx-line bg-nx-ink">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-nx-silver/70 sm:flex-row sm:px-6">
          <Logo />
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-nx-violet-300" aria-hidden="true" />
            {BUSINESS.location}
          </p>
          <a
            href={BUSINESS.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 transition hover:text-white"
          >
            <Instagram className="h-4 w-4 text-nx-violet-300" aria-hidden="true" />@{BUSINESS.instagram}
          </a>
        </div>
      </footer>
    </div>
  );
}