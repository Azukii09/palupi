import { revalidateTag } from "next/cache";
import {ApiEnvelope} from "@/lib/type/api";

const BASE = process.env.API_BASE ?? process.env.RUST_API_BASE ?? process.env.NEXT_PUBLIC_API_BASE;
if (!BASE) {
  // Surface early in dev
  console.warn("[lib/api] Missing API_BASE/RUST_API_BASE/NEXT_PUBLIC_API_BASE");
}

async function parse<T>(res: Response, url: string): Promise<T> {
  if (!res.ok && res.status !== 304) {
    const text = await res.text().catch(() => "");
    throw new Error(`[api] HTTP ${res.status} @ ${url} → ${text}`);
  }
  if (res.status === 304) throw new Error("Not Modified");
  const json = (await res.json()) as ApiEnvelope<T>;
  if (json.status_code !== 200) {
    throw new Error(`[api] API ${json.status_code} @ ${url}: ${json.message}`);
  }
  return json.data;
}

export async function apiGet<T>(path: string, init?: RequestInit & { next?: NextFetchRequestConfig }) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, { ...init, headers: { Accept: "application/json", ...(init?.headers || {}) }, signal: AbortSignal.timeout?.(4000) });
  return parse<T>(res, url);
}

export async function apiSend<T>(path: string, method: "POST"|"PUT"|"PATCH"|"DELETE", body?: unknown) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout?.(5000),
  });
  return parse<T>(res, url);
}

export function revalidateCategories(path:string) {
  revalidateTag(path);
}
