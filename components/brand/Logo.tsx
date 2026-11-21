import { cn } from "@/lib/utils";

/** The FireClient "F" — traced from the official app icon, redrawn as vector geometry. */
const F_PATH =
  "M91 21 78 32 38 33 38 94 53 94 55 76 78 74 81 53 72 60 59 60 54 58 54 52 57 48 88 48Z";

const DEFS = (
  <defs>
    <linearGradient id="fc-red" x1="46" y1="26" x2="86" y2="96" gradientUnits="userSpaceOnUse">
      <stop offset="0" stopColor="#FF6456" />
      <stop offset="0.45" stopColor="#F03A3A" />
      <stop offset="1" stopColor="#C41C20" />
    </linearGradient>
    <linearGradient id="fc-tile" x1="0" y1="0" x2="0" y2="128" gradientUnits="userSpaceOnUse">
      <stop offset="0" stopColor="#191D23" />
      <stop offset="0.55" stopColor="#101216" />
      <stop offset="1" stopColor="#08090C" />
    </linearGradient>
    <filter id="fc-glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="5.5" />
    </filter>
  </defs>
);

/** Bare mark on a transparent background. */
export function Mark({
  className,
  glow = true,
  tone = "color",
  title,
  style,
}: {
  className?: string;
  glow?: boolean;
  tone?: "color" | "mono";
  title?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 128 128"
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      style={style}
      className={cn("h-10 w-10 shrink-0", className)}
    >
      {tone === "color" && DEFS}
      {tone === "color" && glow && (
        <path d={F_PATH} fill="#FF2D2D" opacity="0.5" filter="url(#fc-glow)" />
      )}
      <path d={F_PATH} fill={tone === "color" ? "url(#fc-red)" : "currentColor"} />
    </svg>
  );
}

/** App-icon tile: the mark inside the rounded dark plate. Used as the site logo. */
export function AppTile({
  className,
  glow = true,
  title,
  style,
}: {
  className?: string;
  glow?: boolean;
  title?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 128 128"
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      style={style}
      className={cn("h-10 w-10 shrink-0", className)}
    >
      {DEFS}
      <rect width="128" height="128" rx="28" fill="url(#fc-tile)" />
      <rect
        x="0.75"
        y="0.75"
        width="126.5"
        height="126.5"
        rx="27.5"
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.08"
        strokeWidth="1.5"
      />
      {glow && <path d={F_PATH} fill="#FF2D2D" opacity="0.45" filter="url(#fc-glow)" />}
      <path d={F_PATH} fill="url(#fc-red)" />
    </svg>
  );
}

export function Logo({
  className,
  size = "md",
  href = "/",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  href?: string;
}) {
  const mark = size === "sm" ? "h-7 w-7" : size === "lg" ? "h-11 w-11" : "h-9 w-9";
  const text = size === "sm" ? "text-base" : size === "lg" ? "text-[1.9rem]" : "text-[1.35rem]";

  return (
    <a
      href={href}
      aria-label="FireClient home"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span className="relative inline-flex">
        <AppTile
          className={cn(
            mark,
            "transition-transform duration-300 ease-out group-hover:-translate-y-px group-hover:scale-[1.03]",
          )}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 rounded-[22%] bg-fire/25 blur-lg transition-opacity duration-500 group-hover:opacity-100 md:opacity-60"
        />
      </span>
      <span className={cn("display uppercase leading-none tracking-[0.045em]", text)}>
        Fire<span className="text-fire">Client</span>
      </span>
    </a>
  );
}
