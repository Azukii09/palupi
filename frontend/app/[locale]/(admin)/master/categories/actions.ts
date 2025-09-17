"use server";
import { z } from "zod";
import {apiSend, revalidateCategories} from "@/lib/utils/api";

type ApiError = { message: string };


const CreateSchema = z.object({ name: z.string().trim().min(1).max(120) });
const UpdateSchema = z.object({ id: z.coerce.number().int().positive(), name: z.string().trim().min(1).max(120) });

export async function createCategory(_: unknown, formData: FormData) {
  const parsed = CreateSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    await apiSend<unknown>(`/api/v1/categories`, "POST", parsed.data);
    revalidateCategories("/master/categories");
    return { ok: true };
  } catch (e: unknown) {
    const err: ApiError = e instanceof Error ? { message: e.message } : { message: "Create failed" };
    return { ok: false, message: err.message };
  }
}

export async function updateCategory(_: unknown, formData: FormData) {
  const parsed = UpdateSchema.safeParse({ id: formData.get("id"), name: formData.get("name") });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input" };
  try {
    await apiSend<unknown>(`/api/v1/categories/${parsed.data.id}`, "PUT", { name: parsed.data.name });
    revalidateCategories("/master/categories");
    return { ok: true };
  } catch (e: any) {
    return { ok: false, message: e?.message ?? "Update failed" };
  }
}

export async function deleteCategory(id: number) {
  try {
    await apiSend<unknown>(`/api/v1/categories/${id}`, "DELETE");
    revalidateCategories("/master/categories");
    return { ok: true };
  } catch (e: any) {
    return { ok: false, message: e?.message ?? "Delete failed" };
  }
}
