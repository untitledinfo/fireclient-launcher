import type { Metadata } from "next";
import { Clapperboard, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { GalleryClient } from "@/components/sections/GalleryClient";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/SectionHeading";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Gallery",
  description:
    "Screenshots of every FireClient launcher screen — dashboard, versions, mods, Modrinth browser, servers, skins, performance check, settings and the in-game menu.",
  path: "/gallery",
  keywords: ["FireClient screenshots", "Minecraft launcher UI", "Minecraft client screenshots"],
  ogImage: "/images/shots/02-versions.webp",
});

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Gallery", path: "/gallery" },
        ]}
        title={
          <>
            The whole
            <br />
            <span className="text-gradient-fire">launcher.</span>
          </>
        }
        description="Every screen of the shipped launcher, straight from v1.0.11 — no mock-ups, no retouching. Click any image to open it full size."
      />

      <Section className="border-b border-line">
        <GalleryClient />
      </Section>

      <Section>
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <SectionHeading
            eyebrow="Video"
            title={
              <>
                No trailer
                <br />
                <span className="text-gradient-fire">yet.</span>
              </>
            }
            description="A launch trailer is in production. We would rather publish nothing than post a mock-up with a fake frame rate counter on it — so for now, the screenshots above are the real thing."
          />
          <div className="rounded-[5px] border border-dashed border-lineStrong px-8 py-10 text-center">
            <Clapperboard className="mx-auto h-6 w-6 text-faint" />
            <p className="mt-3 text-[0.85rem] text-muted">Video showcase</p>
            <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-faint">
              In production
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Button href="/download" size="lg">
            Download v1.0.11 <ArrowRight className="h-4 w-4" />
          </Button>
          <Button href="/features" size="lg" variant="secondary">
            Explore features
          </Button>
        </div>
      </Section>
    </>
  );
}
