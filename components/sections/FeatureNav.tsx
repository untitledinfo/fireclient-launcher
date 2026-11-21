"use client";

import { useEffect, useState } from "react";
import { features } from "@/lib/content";
import { cn } from "@/lib/utils";

export function FeatureNav() {
  const [active, setActive] = useState(features[0].slug);

  useEffect(() => {
    const sections = features
      .map((f) => document.getElementById(f.slug))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label="Feature sections" className="sticky top-28 hidden lg:block">
      <p className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-faint">On this page</p>
      <ul className="mt-4 space-y-0.5">
        {features.map((f, i) => (
          <li key={f.slug}>
            <a
              href={`#${f.slug}`}
              className={cn(
                "group flex items-center gap-3 border-l py-2 pl-3 text-[0.82rem] transition-colors",
                active === f.slug
                  ? "border-fire text-ink"
                  : "border-line text-muted hover:border-lineStrong hover:text-ink",
              )}
            >
              <span className="font-mono text-[0.6rem] text-faint">
                {String(i + 1).padStart(2, "0")}
              </span>
              {f.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
