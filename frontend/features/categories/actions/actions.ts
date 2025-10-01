"use server"

import {apiSend, revalidatePage} from "@/lib/utils/api";
import {ApiEnvelope} from "@/lib/type/api";
import {getLocale, getTranslations} from "next-intl/server";
import { mapZodErrorFromSchema} from "@/lib/type/actionType";
import {
  CreateCategorySchema, DeleteCategorySchema, ToggleCategorySchema, UpdateCategorySchema
} from "@/features/categories/validations/validation";
import {
  Category,
  CategoryCreateAction,
  CategoryDeleteAction, CategoryToggleAction,
  CategoryUpdateAction
} from "@/features/categories/services/category.type";

// actions.ts
export type ActionResult =
  | { ok: true;  message: string, data?: ApiEnvelope<unknown>}   // ← message opsional saat sukses
  | { ok: false; message: string };


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

export const toggleCategoryStatus: CategoryToggleAction = async (_prev,formData) => {
  "use server";

  const locale = await getLocale()
  const parsed = ToggleCategorySchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
  });
  if (!parsed.success) {
    return {
      ok: false as const,
      data: null,
      errors: mapZodErrorFromSchema<typeof ToggleCategorySchema>(parsed.error),
    };
  }

  const { id, status } = parsed.data;

  try {
    await apiSend<void>(`/api/v1/categories/${id}?locale=${locale}`, "PUT", { status });
    return {
      ok: true,
      data: {
        message: status ? "Category activated" : "Category deactivated",
      },
      errors: null
    };
  } catch (e) {
    const msg =
      e instanceof Error ? e.message : "failed to toggle category status";
    return {
      ok: false as const,
      data: null,
      errors: { _form: [msg] }
    };
  }
}
