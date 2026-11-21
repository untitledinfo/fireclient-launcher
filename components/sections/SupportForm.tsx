"use client";

import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { ButtonEl } from "@/components/ui/Button";
import { supportRequestSchema } from "@/lib/schemas";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

const topics = [
  { value: "installation", label: "Installation" },
  { value: "account", label: "Account & sign-in" },
  { value: "performance", label: "Performance" },
  { value: "mods", label: "Mods & modpacks" },
  { value: "other", label: "Something else" },
] as const;

export function SupportForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    const parsed = supportRequestSchema.safeParse(data);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      setStatus("error");
      setMessage("Please fix the highlighted fields.");
      return;
    }

    setErrors({});
    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const body = (await res.json().catch(() => ({}))) as { message?: string; error?: string };

      if (res.ok) {
        setStatus("success");
        setMessage(body.message ?? "Message received.");
        form.reset();
        return;
      }

      setStatus("error");
      setMessage(
        body.message ??
          (body.error === "not_configured"
            ? "The support inbox is not connected yet."
            : "Something went wrong while sending your message."),
      );
    } catch {
      setStatus("error");
      setMessage("Network error — check your connection and try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-[5px] border border-emerald-500/30 bg-emerald-500/[0.06] p-6">
        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
        <h3 className="mt-3 font-display text-[1.35rem] uppercase tracking-wide text-ink">
          Message sent
        </h3>
        <p className="mt-2 text-[0.88rem] leading-relaxed text-inkSoft">{message}</p>
        <button
          onClick={() => {
            setStatus("idle");
            setMessage("");
          }}
          className="mt-4 text-[0.8rem] font-medium uppercase tracking-[0.1em] text-fire hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  const fieldError = (name: string) =>
    errors[name] ? (
      <p className="mt-1.5 flex items-center gap-1.5 text-[0.75rem] text-red-400">
        <AlertCircle className="h-3 w-3" /> {errors[name]}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-[5px] border border-line bg-surface p-5 md:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="eyebrow block">
            Name
          </label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            required
            aria-invalid={Boolean(errors.name)}
            className="mt-2 h-10 w-full rounded-[3px] border border-line bg-bg px-3 text-[0.88rem] text-ink placeholder:text-faint focus:border-fire/50 focus:outline-none"
            placeholder="Your name"
          />
          {fieldError("name")}
        </div>
        <div>
          <label htmlFor="email" className="eyebrow block">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={Boolean(errors.email)}
            className="mt-2 h-10 w-full rounded-[3px] border border-line bg-bg px-3 text-[0.88rem] text-ink placeholder:text-faint focus:border-fire/50 focus:outline-none"
            placeholder="you@example.com"
          />
          {fieldError("email")}
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="topic" className="eyebrow block">
          Topic
        </label>
        <select
          id="topic"
          name="topic"
          defaultValue="installation"
          className="mt-2 h-10 w-full rounded-[3px] border border-line bg-bg px-3 text-[0.88rem] text-ink focus:border-fire/50 focus:outline-none"
        >
          {topics.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        {fieldError("topic")}
      </div>

      <div className="mt-4">
        <label htmlFor="message" className="eyebrow block">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          aria-invalid={Boolean(errors.message)}
          className="mt-2 w-full resize-y rounded-[3px] border border-line bg-bg px-3 py-2.5 text-[0.88rem] leading-relaxed text-ink placeholder:text-faint focus:border-fire/50 focus:outline-none"
          placeholder="What happened, and what did you expect? Include the launcher version and your Minecraft version if relevant."
        />
        {fieldError("message")}
      </div>

      {/* honeypot */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      {status === "error" && message && (
        <div className="mt-4 flex items-start gap-2.5 rounded-[3px] border border-red-500/30 bg-red-500/[0.07] px-3.5 py-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
          <div>
            <p className="text-[0.84rem] text-ink">{message}</p>
            {message.toLowerCase().includes("not connected") && (
              <a
                href={`mailto:${site.contactEmail}`}
                className="mt-1 inline-block text-[0.8rem] text-fire hover:underline"
              >
                Email {site.contactEmail} instead
              </a>
            )}
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <ButtonEl type="submit" disabled={status === "submitting"} size="md">
          {status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Sending
            </>
          ) : (
            <>
              <Send className="h-4 w-4" /> Send message
            </>
          )}
        </ButtonEl>
        <p className="text-[0.72rem] leading-relaxed text-faint">
          We use your email only to reply. Never send passwords or account tokens.
        </p>
      </div>
      <p className={cn("sr-only")} aria-live="polite">
        {status === "submitting" ? "Sending message" : message}
      </p>
    </form>
  );
}
