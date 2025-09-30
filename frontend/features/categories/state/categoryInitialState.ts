import {ActionResultFrom} from "@/lib/type/actionType";
import {
  CreateCategorySchema,
  DeleteCategorySchema,
  UpdateCategorySchema
} from "@/features/categories/validations/validation";
import {CategorySuccess} from "@/features/categories/services/category.type";

export type CategoryCreateState = ActionResultFrom<typeof CreateCategorySchema, CategorySuccess>;

export const categoryCreateInitial: CategoryCreateState = {
  ok: false as const,
  data: null,
  errors: {},
};

export type CategoryUpdateState = ActionResultFrom<typeof UpdateCategorySchema, CategorySuccess>

export const categoryUpdateInitial: CategoryUpdateState = {
  ok: false as const,
  data: null,
  errors: {},
}

export type CategoryDeleteState = ActionResultFrom<typeof DeleteCategorySchema, CategorySuccess>

export const categoryDeleteInitial: CategoryDeleteState = {
  ok: false as const,
  data: null,
  errors: {},
}
