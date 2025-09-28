// ✅ initial state: ok di-narrow literal
import {ActionResultFrom} from "@/lib/type/actionType";
import {CreateCategorySchema} from "@/features/categories/validations/validation";
import {CategoryCreateSuccess} from "@/features/categories/services/category.type";

export type CategoryCreateState = ActionResultFrom<typeof CreateCategorySchema, CategoryCreateSuccess>;


export const categoryCreateInitial: CategoryCreateState = {
  ok: false as const,
  data: null,
  errors: {},
};
