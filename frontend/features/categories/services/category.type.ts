import {ApiEnvelope} from "@/lib/type/api";
import {CategoryCreateState, CategoryUpdateState} from "@/features/categories/state/categoryInitialState";

export type Category = {
  id: string;
  name: string;
  description: string;
  status:boolean;
};

export type CategorySuccess = {
  message: string;
  result?: ApiEnvelope<Category>;
};

// 👉 function type agar implementasi “harus” cocok dgn useActionState (state, FormData)
export type CategoryCreateAction = (
  state: CategoryCreateState,
  payload: FormData
) => Promise<CategoryCreateState>;


export type CategoryUpdateAction = (
  state: CategoryUpdateState,
  payload: FormData
) => Promise<CategoryUpdateState>;
