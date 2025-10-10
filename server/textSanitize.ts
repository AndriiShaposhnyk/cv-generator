export const clean = (s?: string) => (s ?? "").trim();

export const splitSkills = (raw: string) =>
  (raw ?? "")
    .split(/[\n,]/g)
    .map((s) => s.trim())
    .filter(Boolean);

export const splitLines = (raw: string) =>
  (raw ?? "")
    .split(/\n/g)
    .map((s) => s.trim())
    .filter(Boolean);

export const safeFileName = (raw: string, fallback = "resume") =>
  (raw || fallback).replace(/[^\w\s\-]+/g, "").trim() || fallback;