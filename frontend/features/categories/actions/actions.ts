"use server";
import { z } from "zod";
import {apiSend, revalidatePage} from "@/lib/utils/api";
import {ApiEnvelope} from "@/lib/type/api";
import {getLocale, getTranslations} from "next-intl/server";
import { mapZodErrorFromSchema} from "@/lib/type/actionType";
import {
  CreateCategorySchema, DeleteCategorySchema, UpdateCategorySchema
} from "@/features/categories/validations/validation";
import {
  Category,
  CategoryCreateAction,
  CategoryDeleteAction,
  CategoryUpdateAction
} from "@/features/categories/services/category.type";

// actions.ts
export type ActionResult =
  | { ok: true;  message: string, data?: ApiEnvelope<unknown>}   // ← message opsional saat sukses
  | { ok: false; message: string };


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


export const createCategory: CategoryCreateAction = async (_prev, formData) => {
  "use server";

  const locale = await getLocale();
  const tCategory = await getTranslations("Category");

  const parsed = CreateCategorySchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    status: formData.get("status") === "true"
  });

  if (!parsed.success) {
    return {
      ok: false as const,
      data: null,
      errors: mapZodErrorFromSchema<typeof CreateCategorySchema>(parsed.error),
    };
  }

  try {
    const data = (await apiSend(
      `/api/v1/categories?locale=${locale}`,
      "POST",
      parsed.data
    )) as Category;

    revalidatePage("/master/categories");

    return {
      ok: true as const,
      data: {
        message: `${tCategory("create.success")} ${parsed.data.name} ${tCategory(
          "create.success2"
        )}`,
        result: { status_code: 200, message: "Success", data },
      },
      errors: null,
    };
  } catch (e) {
    const msg =
      e instanceof Error ? e.message : tCategory("create.failed");
    return { ok: false as const, data: null, errors: { _form: [msg] } };
  }
};

export const updateCategory: CategoryUpdateAction = async (_prev, formData) => {
  "use server"

  const locale = await getLocale()
  const tCategory = await getTranslations("Category");

  const parsed = UpdateCategorySchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    description: formData.get("description"),
    status: formData.get("status") === "true",
  });
  if (!parsed.success) {
    return {
      ok: false as const,
      data: null,
      errors: mapZodErrorFromSchema<typeof UpdateCategorySchema>(parsed.error),
    };
  }

  try {
    const data = await apiSend<ApiEnvelope<Category>>(
      `/api/v1/categories/${parsed.data.id}?locale=${locale}`,
      "PUT",
      parsed.data,
    )

    return {
      ok: true,
      data:{
        message: `${tCategory('edit.success')} ${parsed.data.name}`,
        result:data
      },
      errors:null};
  } catch (e: unknown) {
    const msg =
      e instanceof Error ? e.message : tCategory('edit.failed');
    return {
      ok: false as const,
      data: null,
      errors: { _form: [msg] }
    };
  }
}

export const deleteCategory: CategoryDeleteAction = async (_prev, formData) => {
  "use server"
  const tCategory = await getTranslations("Category");
  const parsed = DeleteCategorySchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name")
  });
  if (!parsed.success) {
    return {
      ok: false as const,
      data: null,
      errors: mapZodErrorFromSchema<typeof DeleteCategorySchema>(parsed.error),
    };
  }

  try {
    await apiSend(`/api/v1/categories/${parsed.data.id}`, "DELETE");
    return {
      ok: true,
      data: {
        message: `${tCategory('delete.success')} ${parsed.data.name}`,
      },
      errors: null
    };
  } catch (e: unknown) {
    const msg =
      e instanceof Error ? e.message : tCategory('delete.failed');
    return {
      ok: false as const,
      data: null,
      errors: { _form: [msg] }
    };
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
