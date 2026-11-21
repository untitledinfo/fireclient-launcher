import { ArrowLeft, Flame } from "lucide-react";
import { Mark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="relative isolate flex min-h-[70vh] items-center overflow-hidden">
      <div className="absolute inset-0 -z-10 grid-bg opacity-60" />
      <div className="container-x py-24">
        <div className="mx-auto max-w-xl text-center">
          <Mark className="mx-auto h-16 w-16" />
          <p className="mt-8 font-mono text-[0.65rem] uppercase tracking-[0.24em] text-fire">
            Error 404
          </p>
          <h1 className="display mt-4 text-[clamp(2.5rem,7vw,4.5rem)] text-ink">
            Lost in the
            <br />
            <span className="text-gradient-fire">overworld.</span>
          </h1>
          <p className="mt-5 text-[0.95rem] leading-relaxed text-muted">
            This page does not exist. It may have been moved, or the link was mistyped.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/">
              <ArrowLeft className="h-4 w-4" /> Back home
            </Button>
            <Button href="/support" variant="secondary">
              Get help
            </Button>
          </div>
          <p className="mt-10 flex items-center justify-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-faint">
            <Flame className="h-3 w-3 text-fire" /> FireClient
          </p>
        </div>
      </div>
    </div>
  );
}
