import type { Metadata } from "next";
import { Community } from "@/components/home/Community";
import { Compatibility } from "@/components/home/Compatibility";
import { DownloadCTA } from "@/components/home/DownloadCTA";
import { FeatureGrid } from "@/components/home/FeatureGrid";
import { GalleryStrip } from "@/components/home/GalleryStrip";
import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { NewsStrip } from "@/components/home/NewsStrip";
import { PerformanceSection } from "@/components/home/PerformanceSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { softwareApplicationSchema } from "@/lib/schema-org";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "FireClient — Minecraft, Your Way",
  description:
    "FireClient is a Minecraft launcher for Windows, macOS and Linux: isolated instances, Fabric, Forge, NeoForge and Quilt support, a mod and modpack manager, and verified v1.0.11 downloads.",
  path: "/",
  keywords: [
    "Minecraft launcher download",
    "best Minecraft launcher",
    "Minecraft client 2026",
    "modded Minecraft launcher",
  ],
  absoluteTitle: true,
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={softwareApplicationSchema} />
      <Hero />
      <Marquee />
      <PerformanceSection />
      <FeatureGrid limit={6} />
      <Compatibility />
      <GalleryStrip />
      <NewsStrip />
      <Community />
      <DownloadCTA />
    </>
  );
}
