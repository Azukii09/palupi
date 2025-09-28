import {z} from "zod";
import {ApiEnvelope, Category} from "@/lib/type/api";
import {ActionResultFrom} from "@/lib/type/actionType";

export const CategorySchema = z.object({
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

export type CategoryCreateSuccess = {
  message: string;
  result: ApiEnvelope<Category>;
};

export type CategoryCreateState = ActionResultFrom<typeof CategorySchema, CategoryCreateSuccess>;

// ✅ initial state: ok di-narrow literal
export const categoryCreateInitial: CategoryCreateState = {
  ok: false as const,
  data: null,
  errors: {},
};

// 👉 function type agar implementasi “harus” cocok dgn useActionState (state, FormData)
export type CategoryCreateAction = (
  state: CategoryCreateState,
  payload: FormData
) => Promise<CategoryCreateState>;
