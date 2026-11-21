import { cn } from "@/lib/utils";

/**
 * Frames a real screenshot from the shipped launcher. The screenshots already
 * include the application window chrome, so this only adds the presentation
 * border, rounding and shadow used across the site.
 */
export function Shot({
  src,
  alt,
  className,
  imgClassName,
  priority,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[6px] border border-line bg-surface shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)]",
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        width={1280}
        height={768}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={cn("h-auto w-full object-cover", imgClassName)}
      />
    </div>
  );
}
