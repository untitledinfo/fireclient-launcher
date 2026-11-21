"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, Cpu, MemoryStick, Monitor, Sparkles } from "lucide-react";
import { useState } from "react";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

const profiles = [
  {
    id: "balanced",
    name: "Balanced",
    tagline: "The default for most players",
    heap: "4096 MB",
    distance: "12 chunks",
    icon: Cpu,
    flags: [
      { flag: "-XX:+UseG1GC", why: "G1 garbage collector — shorter pauses than the legacy collector on modern JDKs." },
      { flag: "-Xms4G -Xmx4G", why: "Equal initial and maximum heap, so the runtime never resizes mid-session." },
      { flag: "-XX:MaxGCPauseMillis=50", why: "G1 aims for pauses under 50 ms. A target, not a guarantee." },
    ],
    note: "Good starting point for vanilla and light modpacks on 8–16 GB systems.",
  },
  {
    id: "competitive",
    name: "Competitive",
    tagline: "Lower latency, smaller world view",
    heap: "3072 MB",
    distance: "8 chunks",
    icon: Sparkles,
    flags: [
      { flag: "-XX:+UseG1GC", why: "Same collector, but with a tighter pause target for steadier frame pacing." },
      { flag: "-XX:MaxGCPauseMillis=30", why: "Prioritises short pauses over total collection throughput." },
      { flag: "-XX:+PerfDisableSharedMem", why: "Avoids writing GC pause data to disk, which can cause occasional stalls." },
    ],
    note: "Smaller render distance and heap reduce memory pressure. Visual range is the trade-off.",
  },
  {
    id: "cinematic",
    name: "Cinematic",
    tagline: "Detail first, for capable hardware",
    heap: "8192 MB",
    distance: "20 chunks",
    icon: Monitor,
    flags: [
      { flag: "-XX:+UseG1GC", why: "Large heaps in particular benefit from G1's region-based collection." },
      { flag: "-Xms8G -Xmx8G", why: "A fixed heap large enough for shaders and high-resolution resource packs." },
      { flag: "-XX:G1NewSizePercent=30", why: "Reserves more of the heap for young generation objects — fewer full collections." },
    ],
    note: "Needs 16 GB of system memory or more. On smaller systems this profile will hurt, not help.",
  },
];

export function PerformanceSection() {
  const [active, setActive] = useState(profiles[0].id);
  const profile = profiles.find((p) => p.id === active) ?? profiles[0];
  const reduce = useReducedMotion();

  return (
    <Section id="performance" className="border-b border-line">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="Performance"
            index="01"
            title={
              <>
                Inspect every
                <br />
                <span className="text-gradient-fire">flag.</span>
              </>
            }
            description="No launcher can hand you a frame rate. What FireClient does is make every setting that affects performance visible, editable and explainable — then get out of the way."
          />

          <Reveal delay={0.1}>
            <div className="mt-8 flex gap-3 rounded-[4px] border border-amber-500/25 bg-amber-500/[0.06] p-4">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <p className="text-[0.85rem] leading-relaxed text-inkSoft">
                <span className="font-medium text-ink">Honest by design:</span> we
                publish no invented benchmark numbers. Frame rate depends on your
                hardware, your world and your mod list. Measure it yourself.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-6">
              {[
                { icon: MemoryStick, label: "Heap", value: "Per instance" },
                { icon: Cpu, label: "JVM flags", value: "Editable" },
                { icon: Monitor, label: "Display", value: "Per instance" },
              ].map((s) => (
                <div key={s.label}>
                  <s.icon className="h-4 w-4 text-fire" />
                  <p className="mt-2 font-mono text-[0.55rem] uppercase tracking-[0.16em] text-faint">
                    {s.label}
                  </p>
                  <p className="text-[0.85rem] text-ink">{s.value}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.05}>
          <div className="overflow-hidden rounded-[6px] border border-line bg-surface shadow-card">
            <div className="flex border-b border-line" role="tablist" aria-label="Performance profiles">
              {profiles.map((p) => (
                <button
                  key={p.id}
                  role="tab"
                  aria-selected={active === p.id}
                  onClick={() => setActive(p.id)}
                  className={cn(
                    "relative flex-1 px-3 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.1em] transition-colors",
                    active === p.id ? "text-fire" : "text-muted hover:text-ink",
                  )}
                >
                  {p.name}
                  {active === p.id && (
                    <motion.span
                      layoutId={reduce ? undefined : "profile-tab"}
                      className="absolute inset-x-0 bottom-0 h-[2px] bg-fire"
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="p-5 md:p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={profile.id}
                  initial={reduce ? undefined : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="display text-[1.5rem] text-ink">{profile.name}</h3>
                      <p className="mt-1 text-[0.82rem] text-muted">{profile.tagline}</p>
                    </div>
                    <profile.icon className="h-5 w-5 text-fire" />
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-[3px] border border-line bg-line">
                    <div className="bg-surface2 px-3 py-2.5">
                      <p className="font-mono text-[0.52rem] uppercase tracking-[0.16em] text-faint">
                        Heap
                      </p>
                      <p className="mt-0.5 font-mono text-[0.8rem] text-ink">{profile.heap}</p>
                    </div>
                    <div className="bg-surface2 px-3 py-2.5">
                      <p className="font-mono text-[0.52rem] uppercase tracking-[0.16em] text-faint">
                        Render distance
                      </p>
                      <p className="mt-0.5 font-mono text-[0.8rem] text-ink">{profile.distance}</p>
                    </div>
                  </div>

                  <ul className="mt-5 space-y-3">
                    {profile.flags.map((f) => (
                      <li key={f.flag} className="border-l border-fire/30 pl-3">
                        <code className="font-mono text-[0.74rem] text-gold">{f.flag}</code>
                        <p className="mt-1 text-[0.8rem] leading-relaxed text-muted">{f.why}</p>
                      </li>
                    ))}
                  </ul>

                  <p className="mt-5 border-t border-line pt-4 text-[0.78rem] leading-relaxed text-faint">
                    {profile.note}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
