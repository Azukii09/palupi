"use server";
import { z } from "zod";
import {apiSend, revalidatePage} from "@/lib/utils/api";
import {ApiEnvelope, Category} from "@/lib/type/api";
import {getLocale, getTranslations} from "next-intl/server";

type ApiError = { message: string };
// actions.ts
export type ActionResult =
  | { ok: true;  message: string, data?: ApiEnvelope<unknown>}   // ← message opsional saat sukses
  | { ok: false; message: string };

const DeleteSchema = z.object({
  id: z.coerce.string().trim(),
  name: z.string().trim().min(1).max(120) ,
});

const CreateSchema = z.object({ 
  name: z.string().trim().min(1).max(120) ,
  description: z.string().trim().min(4).max(120).optional(),
  status: z.boolean().optional(),
})

const UpdateSchema = z.object({
  id: z.coerce.string().trim(),
  name: z.string().trim().min(1).max(120) ,
  description: z.string().trim().min(4).max(120).optional(),
  status: z.boolean().optional(),
});

const zBoolFromForm = z.union([z.boolean(), z.string()]).transform((v) => {
  if (typeof v === "boolean") return v;
  const s = v.trim().toLowerCase();
  if (["true", "1", "on", "yes", "y"].includes(s)) return true;
  if (["false", "0", "off", "no", "n"].includes(s)) return false;
  // kalau nilai aneh, kamu bisa:
  // - return false;  // fallback aman
  // - atau throw new Error("Invalid boolean"); // biar gagal validasi
  return false;
});

const ToggleSchema = z.object({
  id: z.string().min(1),
  status: zBoolFromForm,
});

export async function createCategory(_prev: ActionResult,formData: FormData) {
  const locale = await getLocale()
  const tCategory = await getTranslations("Category");
  const parsed = CreateSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    status: formData.get("status") === "true",
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? tCategory('create.invalid') };
  }

  try {
    const data  = await apiSend<unknown>(`/api/v1/categories?locale=${locale}`, "POST", parsed.data) as Category;

    const result : ApiEnvelope<Category> = {
      status_code: 200,
      message: "Success",
      data: data
    }
    revalidatePage("/master/categories");
    return {ok: true, message: `${tCategory('create.success')} ${parsed.data.name} ${tCategory('create.success2')}`, data: result};
  } catch (e: unknown) {
    const err: ApiError = e instanceof Error ? { message: e.message } : { message: tCategory('create.failed') };
    return { ok: false, message: err.message };
  }
}

export async function updateCategory(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const locale = await getLocale()
  const tCategory = await getTranslations("Category");

  const parsed = UpdateSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    description: formData.get("description"),
    status: formData.get("status") === "true",
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? tCategory('edit.invalid') };
  }

  try {
    await apiSend<void>(
      `/api/v1/categories/${parsed.data.id}?locale=${locale}`,
      "PUT",
      parsed.data,
    );

    // Pilih salah satu (atau keduanya) sesuai strategi cache kamu:
    revalidatePage("/master/categories");    // by path

    return { ok: true, message: `${tCategory('success')} ${parsed.data.name}` };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : tCategory('edit.failed');
    return { ok: false, message };
  }
}

export async function deleteCategory(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const parsed = DeleteSchema.safeParse({ id: formData.get("id"), name: formData.get("name") });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid id" };
  }

  try {
    await apiSend<void>(`/api/v1/categories/${parsed.data.id}`, "DELETE");
    // Sesuaikan dengan strategi revalidate kamu
    return { ok: true, message: `Successfully deleted ${parsed.data.name}` };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Delete failed";
    return { ok: false, message: msg };
  }
}

export async function toggleCategoryStatus(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const locale = await getLocale()
  const parsed = ToggleSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
  });
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid payload";
    return { ok: false, message: msg };
  }

  const { id, status } = parsed.data;

  try {
    // Sesuaikan method/path backend kamu:
    // - Jika backend PATCH sebagian: "PATCH" { status }
    // - Jika backend PUT penuh: "PUT" { status }
    await apiSend<void>(`/api/v1/categories/${id}?locale=${locale}`, "PUT", { status });

    // ⚠️ Biarkan revalidate/refresh dilakukan DI CLIENT setelah toast/modal
    // supaya komponen ini tidak keburu unmount.
    return {
      ok: true,
      message: status ? "Category activated" : "Category deactivated",
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Toggle failed";
    return { ok: false, message: msg };
  }
}
