import { BUSINESS } from '../config/business';

interface LogoProps {
  /** 'stacked': marca arriba y nombre abajo (hero). 'inline': marca a la izquierda (header). */
  layout?: 'stacked' | 'inline';
  className?: string;
}

export function LogoMark({ className = 'h-12 w-auto' }: { className?: string }) {
  if (BUSINESS.logoSrc) {
    return <img src={BUSINESS.logoSrc} alt="" className={className} />;
  }
  return (
    <svg viewBox="0 0 76 52" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="nx-n" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#cfb1e6" />
          <stop offset="0.55" stopColor="#8f4fc7" />
          <stop offset="1" stopColor="#350862" />
        </linearGradient>
        <linearGradient id="nx-x" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor="#d9d3de" />
          <stop offset="1" stopColor="#8d8794" />
        </linearGradient>
      </defs>
      <path d="M4 46V6h9l17 24V6h9v40h-9L13 22v24z" fill="url(#nx-n)" />
      <path d="M44 6l22 40M66 6L44 46" stroke="url(#nx-x)" strokeWidth="8.5" fill="none" strokeLinecap="butt" />
      <path d="M70 2l1.6 4.4L76 8l-4.4 1.6L70 14l-1.6-4.4L64 8l4.4-1.6z" fill="#cfb1e6" />
    </svg>
  );
}

export function Logo({ layout = 'inline', className = '' }: LogoProps) {
  const [first, ...rest] = BUSINESS.name.split(' ');
  const second = rest.join(' ');

  if (layout === 'stacked') {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <LogoMark className="h-20 w-auto drop-shadow-[0_0_24px_rgba(144,85,200,0.7)] sm:h-24" />
        <span className="mt-3 font-display text-3xl font-bold uppercase tracking-[0.18em] text-white sm:text-4xl">
          {first}
        </span>
        <span className="font-display text-sm font-semibold uppercase tracking-[0.5em] text-nx-violet-300 sm:text-base">
          {second}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoMark className="h-8 w-auto" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-bold uppercase tracking-[0.14em] text-white">{first}</span>
        <span className="font-display text-[0.6rem] font-semibold uppercase tracking-[0.42em] text-nx-violet-300">
          {second}
        </span>
      </span>
    </div>
  );
}