import { NextResponse } from "next/server";
import { supportRequestSchema } from "@/lib/schemas";

export const runtime = "nodejs";

/** Very small in-memory throttle — enough for a single-instance deployment. */
const buckets = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 8;

function rateLimit(key: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (bucket.count >= MAX_PER_WINDOW) return false;
  bucket.count += 1;
  return true;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: "rate_limited", message: "Too many messages from this address. Try again later." },
      { status: 429 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { error: "invalid_json", message: "The request body could not be read." },
      { status: 400 },
    );
  }

  const parsed = supportRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "validation_failed",
        message: "Some fields need attention.",
        issues: parsed.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
      },
      { status: 422 },
    );
  }

  // Honeypot: silently accept so bots do not learn the field is checked.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true, message: "Message received." });
  }

  const webhook = process.env.SUPPORT_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json(
      {
        error: "not_configured",
        message:
          "The support inbox is not connected yet. Set SUPPORT_WEBHOOK_URL to enable the form, or email us directly.",
      },
      { status: 503 },
    );
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.SUPPORT_WEBHOOK_TOKEN
          ? { Authorization: `Bearer ${process.env.SUPPORT_WEBHOOK_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({
        source: "fireclient.net/support",
        receivedAt: new Date().toISOString(),
        name: parsed.data.name,
        email: parsed.data.email,
        topic: parsed.data.topic,
        message: parsed.data.message,
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "upstream_failed", message: "The support inbox rejected the message. Please email us instead." },
        { status: 502 },
      );
    }
  } catch {
    return NextResponse.json(
      { error: "upstream_unreachable", message: "Could not reach the support inbox. Please email us instead." },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Thanks — your message reached support. We reply to the email address you provided.",
  });
}
