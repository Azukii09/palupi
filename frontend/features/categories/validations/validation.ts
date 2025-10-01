import {z} from "zod";

export const CreateCategorySchema = z.object({
  name: z.string()
    .trim()
    .min(4, "validation.name.min")
    .max(120, "validation.name.max") ,
  description: z.string()
    .trim()
    .min(4, "validation.description.min")
    .max(120, "validation.description.max")
    .optional(),
  status: z.boolean()
    .optional(),
});

export const UpdateCategorySchema = z.object({
  id: z.string().trim(),
  name: z.string()
    .trim()
    .min(4, "validation.name.min")
    .max(120, "validation.name.max")
    .optional(),
  description: z.string()
    .trim()
    .min(4, "validation.description.min")
    .max(120, "validation.description.max")
    .optional(),
  status: z.boolean()
    .optional(),
});

export const DeleteCategorySchema = z.object({
  id: z.string().trim(),
  name: z.string()
    .trim()
    .min(4, "validation.name.min")
    .max(120, "validation.name.max"),
})

const zBoolFromFormCategory = z.union([z.boolean(), z.string()]).transform((v) => {
  if (typeof v === "boolean") return v;
  const s = v.trim().toLowerCase();
  if (["true", "1", "on", "yes", "y"].includes(s)) return true;
  if (["false", "0", "off", "no", "n"].includes(s)) return false;
  // kalau nilai aneh, kamu bisa:
  // - return false;  // fallback aman
  // - atau throw new Error("Invalid boolean"); // biar gagal validasi
  return false;
});

export const ToggleCategorySchema = z.object({
  id: z.string().min(1),
  status: zBoolFromFormCategory,
});
