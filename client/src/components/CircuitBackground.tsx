/** Fondo de circuitos con brillo violeta, inspirado en la gráfica del posteo. Decorativo. */
export function CircuitBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 left-1/2 h-[34rem] w-[60rem] -translate-x-1/2 rounded-full bg-nx-violet-700/30 blur-[120px]" />
      <div className="absolute bottom-0 left-1/2 h-72 w-[80rem] -translate-x-1/2 rounded-[100%] bg-nx-violet-600/20 blur-[100px]" />
      <svg
        className="absolute inset-0 h-full w-full text-nx-violet-500 opacity-40"
        viewBox="0 0 1200 700"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <g strokeLinejoin="round">
          <path d="M0 120h180l40 40h160l30-30h120" />
          <path d="M0 200h90l40 40h210" />
          <path d="M0 300h140l30 30h100v80h120" />
          <path d="M0 520h200l50-50h140" />
          <path d="M1200 90h-160l-40 40h-150l-30-30h-90" />
          <path d="M1200 190h-110l-40 40H860" />
          <path d="M1200 330h-130l-30 30H920v90H800" />
          <path d="M1200 540h-190l-50-50H820" />
        </g>
        <g fill="currentColor" stroke="none">
          <circle cx="500" cy="100" r="4" />
          <circle cx="340" cy="240" r="4" />
          <circle cx="390" cy="410" r="4" />
          <circle cx="390" cy="470" r="4" />
          <circle cx="700" cy="100" r="4" />
          <circle cx="860" cy="230" r="4" />
          <circle cx="800" cy="450" r="4" />
          <circle cx="820" cy="490" r="4" />
        </g>
      </svg>
    </div>
  );
}