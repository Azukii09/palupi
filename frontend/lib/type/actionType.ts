// app/(lib)/validation/types.ts
import { z } from "zod";

export type FieldsFrom<S extends z.ZodTypeAny> = z.input<S>;
export type KeysOf<S extends z.ZodTypeAny> = Extract<keyof FieldsFrom<S>, string>;

export type FieldErrorsFrom<S extends z.ZodTypeAny> =
  Partial<Record<KeysOf<S> | "_form", string[]>>;

export type ActionResultFrom<S extends z.ZodTypeAny, D = undefined> =
  | { ok: true; data: D; errors: null }
  | { ok: false; data: null; errors: FieldErrorsFrom<S> };

/** Map ZodError → FieldErrorsFrom<S> (tanpa any, tanpa spread) */
export function mapZodErrorFromSchema<S extends z.ZodTypeAny>(
  err: z.ZodError
): FieldErrorsFrom<S> {
  type K = KeysOf<S>;
  const fieldMap: Partial<Record<K, string[]>> = {};
  const formErrors: string[] = [];

  for (const issue of err.issues) {
    const p0 = issue.path?.[0];
    if (typeof p0 === "string") {
      const key = p0 as K;
      (fieldMap[key] ??= []).push(issue.message);
    } else {
      formErrors.push(issue.message);
    }
  }

  const out: Partial<Record<K | "_form", string[]>> = {};
  for (const key in fieldMap) {
    const k = key as K;
    const val = fieldMap[k];
    if (val && val.length) out[k] = val;
  }
  if (formErrors.length) out._form = formErrors;

  return out as FieldErrorsFrom<S>;
}
