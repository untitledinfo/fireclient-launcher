const items = [
  "Vanilla",
  "Fabric",
  "Forge",
  "NeoForge",
  "Quilt",
  "Snapshots",
  "Isolated instances",
  "SHA-256 verified",
  "Microsoft OAuth",
  "Per-instance Java",
];

export function Marquee() {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-b border-line bg-bg2 py-4">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-bg2 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-bg2 to-transparent" />
      <div className="flex w-max animate-marquee items-center">
        {row.map((item, i) => (
          <div key={`${item}-${i}`} className="flex items-center">
            <span className="whitespace-nowrap px-6 font-mono text-[0.66rem] uppercase tracking-[0.2em] text-muted">
              {item}
            </span>
            <span className="h-1 w-1 rotate-45 bg-fire/60" />
          </div>
        ))}
      </div>
    </div>
  );
}
