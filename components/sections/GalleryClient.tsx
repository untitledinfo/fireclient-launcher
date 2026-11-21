"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { gallery, type Shot } from "@/lib/content";
import { cn } from "@/lib/utils";

const filters = [
  { id: "all", label: "All" },
  { id: "launcher", label: "Launcher" },
  { id: "ingame", label: "In-game" },
] as const;

export function GalleryClient() {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const [index, setIndex] = useState<number | null>(null);
  const reduce = useReducedMotion();

  const visible: Shot[] = filter === "all" ? gallery : gallery.filter((s) => s.kind === filter);

  const close = useCallback(() => setIndex(null), []);
  const next = useCallback(
    () => setIndex((i) => (i === null ? null : (i + 1) % visible.length)),
    [visible.length],
  );
  const prev = useCallback(
    () => setIndex((i) => (i === null ? null : (i - 1 + visible.length) % visible.length)),
    [visible.length],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, close, next, prev]);

  const active = index === null ? null : visible[index];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
        <div className="flex gap-1 rounded-[3px] border border-line bg-surface p-1">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={cn(
                "rounded-[2px] px-3.5 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] transition-colors",
                filter === f.id
                  ? "bg-fire/12 text-fire shadow-[inset_0_0_0_1px_rgba(255,106,0,0.25)]"
                  : "text-muted hover:text-ink",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-faint">
          {visible.length} {visible.length === 1 ? "item" : "items"}
        </p>
      </div>

      {visible.length > 0 && (
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((shot, i) => (
            <motion.button
              key={shot.src}
              type="button"
              onClick={() => setIndex(i)}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group relative block overflow-hidden rounded-[4px] border border-line bg-surface text-left"
              aria-label={`Open ${shot.title}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <span className="relative block overflow-hidden bg-bg">
                <img
                  src={shot.src}
                  alt={shot.caption}
                  className="aspect-[16/10] w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <span className="absolute right-2 top-2 rounded-[2px] border border-white/15 bg-black/55 px-1.5 py-0.5 font-mono text-[0.5rem] uppercase tracking-[0.14em] text-white/70 backdrop-blur-sm">
                  {shot.tag}
                </span>
              </span>
              <span className="flex items-start justify-between gap-3 border-t border-line bg-surface px-3.5 py-3">
                <span className="min-w-0">
                  <span className="block font-display text-[1.05rem] uppercase leading-none tracking-wide text-ink transition-colors group-hover:text-fire">
                    {shot.title}
                  </span>
                  <span className="mt-1 block text-[0.74rem] leading-snug text-muted">
                    {shot.caption}
                  </span>
                </span>
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-[2px] border border-line text-faint transition-colors group-hover:border-fire/50 group-hover:text-fire">
                  <Maximize2 className="h-3 w-3" />
                </span>
              </span>
            </motion.button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {active && (
          <motion.div
            initial={reduce ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/92 p-4 backdrop-blur-sm"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
          >
            <button
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-[3px] border border-white/15 text-white/70 transition-colors hover:border-fire hover:text-fire"
            >
              <X className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-[3px] border border-white/15 text-white/70 transition-colors hover:border-fire hover:text-fire md:left-8"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next image"
              className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-[3px] border border-white/15 text-white/70 transition-colors hover:border-fire hover:text-fire md:right-8"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <motion.figure
              key={active.src}
              initial={reduce ? undefined : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="max-h-[88vh] w-full max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={active.src}
                alt={active.caption}
                className="max-h-[76vh] w-full rounded-[4px] object-contain"
              />
              <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-display text-[1.3rem] uppercase tracking-wide text-white">
                  {active.title}
                </span>
                <span className="text-[0.8rem] text-white/50">{active.caption}</span>
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
