import { NextResponse } from "next/server";
import { latestRelease } from "@/lib/content";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      service: "fireclient-web",
      release: { version: latestRelease.version, status: latestRelease.status },
      time: new Date().toISOString(),
    },
    { headers: { "Cache-Control": "public, max-age=0, s-maxage=60" } },
  );
}
