"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { nav, site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-line bg-bg/85 backdrop-blur-xl supports-[backdrop-filter]:bg-bg/70"
          : "border-b border-transparent bg-gradient-to-b from-bg/70 to-transparent",
      )}
    >
      <div className="container-x flex h-16 items-center justify-between gap-6 md:h-[4.5rem]">
        <Logo size="md" />

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative rounded-[3px] px-3 py-2 text-[0.82rem] font-medium tracking-wide transition-colors",
                isActive(item.href) ? "text-ink" : "text-muted hover:text-ink",
              )}
            >
              {item.label}
              {isActive(item.href) && (
                <span className="absolute inset-x-3 bottom-0 h-[2px] bg-fire shadow-[0_0_10px_1px_var(--fire-line)]" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/download"
            className="group hidden h-9 items-center gap-2 rounded-[3px] bg-gradient-to-b from-gold via-ember to-fire px-4 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#12060a] shadow-[0_8px_24px_-12px_rgba(255,106,0,0.8)] transition-all hover:brightness-105 sm:inline-flex"
          >
            Download
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-[3px] border border-lineStrong bg-surface text-ink lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={reduce ? undefined : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="border-t border-line bg-bg/98 backdrop-blur-2xl lg:hidden"
          >
            <div className="container-x flex flex-col py-4">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center justify-between border-b border-line/60 py-3.5 text-base font-medium",
                    isActive(item.href) ? "text-fire" : "text-ink",
                  )}
                >
                  {item.label}
                  <ArrowUpRight className="h-4 w-4 opacity-40" />
                </Link>
              ))}
              <Link
                href="/download"
                onClick={() => setOpen(false)}
                className="mt-5 inline-flex h-12 items-center justify-center rounded-[3px] bg-gradient-to-b from-gold via-ember to-fire text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-[#12060a]"
              >
                Download FireClient
              </Link>
              <p className="mt-4 text-center font-mono text-[0.65rem] uppercase tracking-[0.18em] text-faint">
                {site.tagline}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
