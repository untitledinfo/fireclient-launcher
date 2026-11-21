import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { FaqClient } from "@/components/sections/FaqClient";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/SectionHeading";
import { faqs } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "FAQ",
  description:
    "Answers about installing FireClient, Microsoft sign-in, JVM and RAM settings, update channels, mod compatibility, supported platforms and troubleshooting launcher errors.",
  path: "/faq",
  keywords: [
    "FireClient FAQ",
    "Minecraft launcher Microsoft login",
    "Minecraft launcher RAM settings",
  ],
});

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHero
        eyebrow="FAQ"
        crumbs={[
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ]}
        title={
          <>
            Straight
            <br />
            <span className="text-gradient-fire">answers.</span>
          </>
        }
        description="Installation, accounts, performance, updates and mods. If something is missing, support is one page away."
      >
        <Button href="/support" variant="secondary" size="md">
          Contact support
        </Button>
      </PageHero>

      <Section>
        <FaqClient />

        <div className="mt-12 flex flex-col items-start justify-between gap-5 rounded-[5px] border border-line bg-surface p-6 md:flex-row md:items-center">
          <div>
            <p className="eyebrow">Still stuck?</p>
            <p className="mt-2 max-w-lg text-[0.9rem] leading-relaxed text-inkSoft">
              Send a report with your launcher log and system details. We answer
              directly — there is no ticket queue to disappear into.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button href="/support#report">Report an issue</Button>
            <Button href={`mailto:${site.contactEmail}`} variant="outline">
              Email us
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
