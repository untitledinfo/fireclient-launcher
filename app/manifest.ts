import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.tagline}`,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#08090d",
    theme_color: "#ff2d2d",
    categories: ["games", "utilities"],
    icons: [
      { src: "/brand/app-icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
