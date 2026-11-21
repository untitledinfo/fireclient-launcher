import { z } from "zod";

export const supportTopicSchema = z.enum([
  "installation",
  "account",
  "performance",
  "mods",
  "other",
]);

export const supportRequestSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  topic: supportTopicSchema,
  message: z
    .string()
    .trim()
    .min(20, "Please add at least 20 characters so we can help.")
    .max(4000, "Please keep it under 4000 characters."),
  /** Honeypot: real users never fill this. */
  company: z.string().max(0).optional().default(""),
});

export type SupportRequest = z.infer<typeof supportRequestSchema>;

export const releaseFileSchema = z.object({
  os: z.enum(["windows", "macos", "linux"]),
  /** Human label for the artifact: Installer, Portable, DMG, AppImage… */
  label: z.string().min(1),
  name: z.string().min(1),
  sizeBytes: z.number().int().positive(),
  sha256: z.string().regex(/^[a-f0-9]{64}$/i, "Expected a SHA-256 hex digest"),
  url: z.string().url(),
});

export const releaseSchema = z.object({
  version: z.string().min(1),
  channel: z.enum(["stable", "beta"]),
  status: z.enum(["available", "unreleased"]),
  releasedAt: z.string().datetime(),
  statusNote: z.string().optional(),
  /** Canonical GitHub release page for this tag. */
  pageUrl: z.string().url().optional(),
  highlights: z.array(z.string()).default([]),
  files: z.array(releaseFileSchema).default([]),
});

export type ReleaseFile = z.infer<typeof releaseFileSchema>;
export type Release = z.infer<typeof releaseSchema>;
