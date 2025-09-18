// lib/api.ts
import { revalidatePath, revalidateTag } from "next/cache";
import type { ApiEnvelope } from "@/lib/type/api";

const BASE =
  process.env.API_BASE ??
  process.env.RUST_API_BASE ??
  process.env.NEXT_PUBLIC_API_BASE;

if (!BASE) {
  // Biar cepat ketahuan saat dev/server action jalan
  console.warn("[lib/api] Missing API_BASE/RUST_API_BASE/NEXT_PUBLIC_API_BASE");
}

/**
 * Terima semua 2xx sebagai sukses.
 * Support dua pola:
 *  - Amplop: { status_code, message, data }
 *  - Plain JSON: langsung objek tanpa amplop
 *  - 204 No Content: sukses tanpa body → return undefined
 */
async function parse<T>(res: Response, url: string): Promise<T | undefined> {
  // 1) HTTP layer
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`[api] HTTP ${res.status} @ ${url} → ${text}`);
  }

  // 2) 204 No Content
  if (res.status === 204) return undefined;

  // 3) Coba parse JSON (kalau body kosong tapi 2xx selain 204, anggap undefined)
  let json: unknown = undefined;
  try {
    json = await res.json();
  } catch {
    return undefined;
  }

  // 4) Kalau pakai amplop
  const maybe = json as Partial<ApiEnvelope<T>>;
  if (typeof maybe?.status_code === "number") {
    const code = maybe.status_code;
    if (code < 200 || code >= 300) {
      throw new Error(`[api] API ${code} @ ${url}: ${maybe.message ?? "Error"}`);
    }
    return maybe.data as T | undefined;
  }

  // 5) Tanpa amplop → langsung kembalikan objeknya
  return json as T;
}

export async function apiGet<T>(
  path: string,
  init?: RequestInit & { next?: NextFetchRequestConfig }
): Promise<T> {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: { Accept: "application/json", ...(init?.headers || {}) },
    signal: AbortSignal.timeout?.(4000),
  });
  const data = await parse<T>(res, url);
  // GET umumnya selalu ada body; kalau undefined, lemparkan agar ketahuan
  if (typeof data === "undefined") {
    throw new Error(`[api] Empty response for GET ${url}`);
  }
  return data;
}

export async function apiSend<T>(
  path: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  body?: unknown
): Promise<T | undefined> {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout?.(5000),
  });
  return parse<T>(res, url); // bisa undefined untuk 204/no-body
}

/**
 * revalidateCategories:
 * - Kalau input diawali '/' → dianggap PATH → pakai revalidatePath
 * - Selain itu → dianggap TAG → pakai revalidateTag
 *
 * Contoh:
 *   revalidateCategories("/master/categories");  // path
 *   revalidateCategories("categories");          // tag
 */
export function revalidateCategories(target: string) {
  if (target.startsWith("/")) {
    revalidatePath(target);
  } else {
    revalidateTag(target);
  }
}
