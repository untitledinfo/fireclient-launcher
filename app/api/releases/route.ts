import { NextResponse } from "next/server";
import { latestRelease, previousReleases } from "@/lib/content";
import { releaseSchema } from "@/lib/schemas";

/**
 * Public release feed.
 *
 * Only releases that are actually published are exposed: when a release is
 * marked "unreleased" it is returned with status "unreleased" and an empty file
 * list, so clients cannot construct a download for a build that does not exist.
 */
export async function GET() {
  const parsed = releaseSchema.safeParse(latestRelease);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "release_feed_invalid", message: "The release feed is misconfigured." },
      { status: 500 },
    );
  }

  const release = parsed.data;
  const payload = {
    latest:
      release.status === "available"
        ? release
        : { ...release, files: [], status: "unreleased" as const },
    previous: previousReleases
      .filter((r) => r.status === "available")
      .map((r) => ({ ...r, files: r.files })),
  };

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
