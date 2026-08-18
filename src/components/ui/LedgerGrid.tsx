export function LedgerGrid() {
  return (
    <div className="pointer-events-none absolute inset-0 select-none" aria-hidden="true">
      <svg className="h-full w-full" width="100%" height="100%">
        <defs>
          <pattern id="ledger-lines" width="120" height="44" patternUnits="userSpaceOnUse">
            <path d="M0 43.5 H120" stroke="rgba(212,175,55,0.10)" strokeWidth="1" fill="none" />
            <path d="M119.5 0 V44" stroke="rgba(212,175,55,0.055)" strokeWidth="1" fill="none" />
          </pattern>
          <radialGradient id="ledger-fade" cx="18%" cy="12%" r="92%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#fff" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="ledger-mask">
            <rect width="100%" height="100%" fill="url(#ledger-fade)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#ledger-lines)" mask="url(#ledger-mask)" />
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-navy-deep to-transparent" />
    </div>
  );
}
