import { NextResponse } from "next/server";
import { posts } from "@/lib/content";

export async function GET() {
  const items = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    publishedAt: p.publishedAt,
    readingMinutes: p.readingMinutes,
  }));

  return NextResponse.json(
    { items },
    {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
      },
    },
  );
}
