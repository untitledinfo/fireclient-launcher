import { ArrowUpRight, Maximize2 } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";
import { gallery } from "@/lib/content";
import { cn } from "@/lib/utils";

export function GalleryStrip() {
  return (
    <Section className="border-b border-line">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading
          eyebrow="Gallery"
          index="04"
          title={
            <>
              Straight from
              <br />
              <span className="text-gradient-fire">the build.</span>
            </>
          }
          description="Real screenshots of the shipped launcher — the dashboard, version library, server browser and the in-game overlay."
        />
        <Link
          href="/gallery"
          className="group inline-flex shrink-0 items-center gap-2 border-b border-lineStrong pb-1 text-[0.8rem] font-medium uppercase tracking-[0.1em] text-ink transition-colors hover:border-fire hover:text-fire"
        >
          Open gallery
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
        </Link>
      </div>

      <div className="mt-12 grid gap-3 md:grid-cols-4 md:grid-rows-2">
        {[
          "01-dashboard.webp",
          "02-versions.webp",
          "09-servers.webp",
          "14-ingame-menu.webp",
        ]
          .map((file) => gallery.find((s) => s.src.endsWith(file)))
          .filter((s): s is NonNullable<typeof s> => Boolean(s))
          .map((shot, i) => (
          <Reveal
            key={shot.src}
            delay={i * 0.06}
            className={cn(
              i === 0 && "md:col-span-2 md:row-span-2",
              i === 1 && "md:col-span-2",
            )}
          >
            <Link
              href="/gallery"
              className="group relative block h-full min-h-[13rem] overflow-hidden rounded-[4px] border border-line"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={shot.src}
                alt={shot.caption}
                className={cn(
                  "h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]",
                  i === 0 ? "min-h-[20rem]" : "min-h-[13rem]",
                )}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/95 via-bg/20 to-transparent opacity-90" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
                <div>
                  <p className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-gold">
                    {shot.tag}
                  </p>
                  <p className="mt-1 font-display text-[1.15rem] uppercase leading-none tracking-wide text-white">
                    {shot.title}
                  </p>
                </div>
                <Maximize2 className="h-4 w-4 shrink-0 text-white/50 transition-colors group-hover:text-white" />
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
