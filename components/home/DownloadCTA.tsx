import { ArrowRight, Monitor, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { latestRelease } from "@/lib/content";

export function DownloadCTA() {
  const ready = latestRelease.status === "available";

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(80%_120%_at_80%_20%,rgba(255,45,45,0.16),transparent_62%),linear-gradient(180deg,var(--bg-2),var(--bg))]" />
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="absolute inset-y-0 right-0 w-1/2 stripes animate-stripes opacity-40" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fire/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-fire/40 to-transparent" />
      </div>

      <div className="container-x py-24 md:py-32">
        <Reveal>
          <div className="max-w-2xl">
            <span className="eyebrow flex items-center gap-3">
              <span className="h-px w-6 bg-fire" /> Get FireClient
            </span>
            <h2 className="display mt-5 text-[clamp(2.4rem,6.4vw,4.75rem)] text-ink">
              Minecraft,
              <br />
              <span className="text-gradient-fire">your way.</span>
            </h2>
            <p className="mt-5 max-w-xl text-[1rem] leading-relaxed text-inkSoft">
              One launcher for every version, loader and modpack you play. v1.0.11 is
              live for Windows, macOS and Linux — every artifact published with a
              SHA-256 checksum.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="/download" size="lg" className="group">
                {ready ? "Download v1.0.11" : "Check release status"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button href="/features" size="lg" variant="secondary">
                See what is inside
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-lineStrong/60 pt-5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-faint">
              <span className="flex items-center gap-2">
                <Monitor className="h-3.5 w-3.5" /> Windows · macOS · Linux
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5" /> SHA-256 verified
              </span>
              <span>v{latestRelease.version}</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
