"use server";
import { z } from "zod";
import {apiSend, revalidatePage} from "@/lib/utils/api";
import {ApiEnvelope, Category} from "@/lib/type/api";
import {getLocale} from "next-intl/server";

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

const UpdateSchema = z.object({ id: z.coerce.number().int().positive(), name: z.string().trim().min(1).max(120) });

export async function createCategory(_prev: ActionResult,formData: FormData) {
  const locale = await getLocale()
  const parsed = CreateSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    status: formData.get("status") === "true",
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const data  = await apiSend<unknown>(`/api/v1/categories?locale=${locale}`, "POST", parsed.data) as Category;

    const result : ApiEnvelope<Category> = {
      status_code: 200,
      message: "Success",
      data: data
    }
    revalidatePage("/master/categories");
    return {ok: true, message: `Successfully created ${parsed.data.name} as a new category`, data: result};
  } catch (e: unknown) {
    const err: ApiError = e instanceof Error ? { message: e.message } : { message: "Create failed" };
    return { ok: false, message: err.message };
  }
}

export async function updateCategory(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const parsed = UpdateSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    await apiSend<void>(
      `/api/v1/categories/${parsed.data.id}`,
      "PUT",
      { name: parsed.data.name }
    );

    // Pilih salah satu (atau keduanya) sesuai strategi cache kamu:
    revalidatePage("/master/categories");    // by path

    return { ok: true, message: `Successfully updated ${parsed.data.name}` };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Update failed";
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
