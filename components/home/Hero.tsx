"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown, Monitor, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { Shot } from "@/components/launcher/Shot";
import { Badge, Dot } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

/** Deterministic ember field (stable across server/client render). */
const embers = Array.from({ length: 22 }, (_, i) => {
  const seed = (i * 9301 + 49297) % 233280;
  const rnd = seed / 233280;
  return {
    left: `${(i * 4.4 + rnd * 6) % 100}%`,
    delay: `${(rnd * 9).toFixed(2)}s`,
    duration: `${(7 + rnd * 7).toFixed(2)}s`,
    drift: `${(rnd * 80 - 40).toFixed(0)}px`,
    size: rnd > 0.7 ? 3 : 2,
    opacity: 0.25 + rnd * 0.5,
  };
});

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const shotY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 70]);
  const shotScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.04]);

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden border-b border-line bg-bg"
    >
      {/* backdrop: built from light, not stock art */}
      <div className="absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(115%_85%_at_78%_6%,rgba(255,45,45,0.16),transparent_58%),radial-gradient(80%_60%_at_4%_98%,rgba(255,45,45,0.09),transparent_60%)]" />
        <div className="absolute inset-0 grid-bg opacity-70" />
        <div className="absolute inset-0 scanlines opacity-60" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fire/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
      </div>

      {/* slow scan sweep */}
      {!reduce && (
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
          <div className="animate-sweep absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-fire/70 to-transparent shadow-[0_0_18px_2px_rgba(255,45,45,0.4)]" />
        </div>
      )}

      {/* embers */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        {embers.map((e, i) => (
          <span
            key={i}
            className="animate-ember absolute bottom-0 rounded-full bg-fire"
            style={{
              left: e.left,
              width: e.size,
              height: e.size,
              opacity: e.opacity,
              animationDelay: e.delay,
              ["--dur" as string]: e.duration,
              ["--drift" as string]: e.drift,
              boxShadow: "0 0 8px 1px var(--fire-line)",
            }}
          />
        ))}
      </div>

      <div className="container-x">
        <div className="grid min-h-[calc(100svh-4.5rem)] items-center gap-12 py-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10 lg:py-16">
          {/* copy */}
          <motion.div
            initial={reduce ? false : "hidden"}
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
            className="relative z-10 max-w-2xl"
          >
            <motion.div variants={fade} className="flex flex-wrap items-center gap-2.5">
              <Badge tone="fire">
                <Dot /> v1.0.11 · Stable
              </Badge>
              <Badge tone="default">
                <Monitor className="h-3 w-3" /> Windows · macOS · Linux
              </Badge>
            </motion.div>

            <motion.h1
              variants={fade}
              className="display mt-6 text-[clamp(3.2rem,8.6vw,7rem)] text-ink"
            >
              Your world.
              <br />
              <span className="text-gradient-fire">Your rules.</span>
            </motion.h1>

            <motion.div variants={fade} className="mt-5 flex items-center gap-3" aria-hidden>
              <span className="h-[3px] w-16 bg-fire" />
              <span className="h-px flex-1 max-w-[9rem] bg-lineStrong" />
              <span className="font-mono text-[0.58rem] uppercase tracking-[0.22em] text-faint">
                Launcher 1.0.11
              </span>
            </motion.div>

            <motion.p
              variants={fade}
              className="mt-5 max-w-xl text-[1.02rem] leading-relaxed text-inkSoft md:text-[1.08rem]"
            >
              A Minecraft launcher that treats your game like an installation, not a
              guess. Every version, loader, modpack and Java runtime in its own isolated
              instance — with the checksums to prove what you downloaded.
            </motion.p>

            <motion.div variants={fade} className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="/download" size="lg">
                Download v1.0.11
                <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </Button>
              <Button href="/features" size="lg" variant="secondary">
                Explore features
              </Button>
            </motion.div>

            <motion.dl
              variants={fade}
              className="mt-10 grid max-w-lg grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-3"
            >
              {[
                { k: "Channel", v: "Stable", icon: ShieldCheck },
                { k: "Loaders", v: "5 supported", icon: Zap },
                { k: "Platforms", v: "3 builds", icon: Monitor },
              ].map((item) => (
                <div
                  key={item.k}
                  className="flex items-center justify-between gap-3 bg-bg/80 px-3.5 py-3 backdrop-blur-sm sm:block"
                >
                  <dt className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-faint">
                    {item.k}
                  </dt>
                  <dd className="flex items-center gap-1.5 text-[0.82rem] font-medium text-ink sm:mt-1">
                    <item.icon className="h-3 w-3 text-fire" />
                    {item.v}
                  </dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          {/* product shot */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 36, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.25, ease }}
            className="relative z-10"
          >
            <div
              className="absolute -inset-6 -z-10 rounded-full bg-fire/15 blur-[80px] animate-breathe"
              aria-hidden
            />
            <motion.div style={{ y: shotY, scale: shotScale }}>
              <div className="hud-corners-static border border-line bg-surface/40 p-1.5 backdrop-blur-sm">
                <Shot
                  src="/images/shots/01-dashboard.webp"
                  alt="FireClient launcher dashboard showing the launch panel, instance statistics and announcement feed"
                  priority
                  className="border-white/10 shadow-none"
                />
              </div>
            </motion.div>
            <div className="mt-3 flex items-center justify-between border-t border-line px-1 pt-3 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-faint">
              <span className="flex items-center gap-2">
                <Dot tone="success" /> Dashboard · live build
              </span>
              <Link href="/gallery" className="transition-colors hover:text-fire">
                All screens →
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1.5 text-faint lg:flex">
        <span className="font-mono text-[0.52rem] uppercase tracking-[0.24em]">Scroll</span>
        <ChevronDown className="h-3.5 w-3.5 animate-bounce" />
      </div>
    </section>
  );
}

const fade = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};
