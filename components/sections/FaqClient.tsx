"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Minus, Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { faqCategories, faqs, type FaqCategory } from "@/lib/content";
import { cn } from "@/lib/utils";

export function FaqClient() {
  const [category, setCategory] = useState<FaqCategory | "All">("All");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.replace("#", ""));
    if (hash && (faqCategories as string[]).includes(hash)) {
      setCategory(hash as FaqCategory);
    }
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqs.filter(
      (f) =>
        (category === "All" || f.category === category) &&
        (!q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)),
    );
  }, [category, query]);

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {(["All", ...faqCategories] as const).map((c) => (
            <button
              key={c}
              onClick={() => {
                setCategory(c);
                setOpen(null);
              }}
              aria-pressed={category === c}
              className={cn(
                "rounded-[3px] border px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.12em] transition-colors",
                category === c
                  ? "border-fire/40 bg-fire/10 text-fire"
                  : "border-line text-muted hover:border-lineStrong hover:text-ink",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <label className="relative flex items-center">
          <Search className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-faint" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions"
            aria-label="Search frequently asked questions"
            className="h-10 w-full rounded-[3px] border border-line bg-surface pl-9 pr-3 text-[0.85rem] text-ink placeholder:text-faint focus:border-fire/50 focus:outline-none md:w-64"
          />
        </label>
      </div>

      <p className="mt-5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-faint">
        {filtered.length} {filtered.length === 1 ? "answer" : "answers"}
        {category !== "All" && ` in ${category}`}
      </p>

      <div className="mt-4 divide-y divide-line border-y border-line">
        {filtered.map((item) => {
          const id = `${item.category}-${item.q}`;
          const isOpen = open === id;
          return (
            <div key={id} id={item.category} className="scroll-mt-28">
              <button
                onClick={() => setOpen(isOpen ? null : id)}
                aria-expanded={isOpen}
                aria-controls={`panel-${id}`}
                className="flex w-full items-start justify-between gap-6 py-5 text-left transition-colors hover:text-fire"
              >
                <span className="flex items-start gap-4">
                  <span className="mt-0.5 hidden font-mono text-[0.58rem] uppercase tracking-[0.14em] text-faint sm:block">
                    {item.category}
                  </span>
                  <span className="text-[0.98rem] font-medium text-ink">{item.q}</span>
                </span>
                <span
                  className={cn(
                    "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-[2px] border transition-colors",
                    isOpen ? "border-fire/50 text-fire" : "border-line text-muted",
                  )}
                >
                  {isOpen ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`panel-${id}`}
                    initial={reduce ? undefined : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={reduce ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-3xl pb-6 pl-0 text-[0.9rem] leading-relaxed text-muted sm:pl-[8.5rem]">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-[4px] border border-dashed border-lineStrong px-6 py-12 text-center">
          <p className="text-[0.9rem] text-ink">No answer matches that search.</p>
          <p className="mt-1.5 text-[0.82rem] text-muted">
            Try a shorter phrase, or send the question to support.
          </p>
          <a
            href="/support#report"
            className="mt-4 inline-block text-[0.82rem] font-medium uppercase tracking-[0.1em] text-fire hover:underline"
          >
            Contact support
          </a>
        </div>
      )}
    </div>
  );
}
