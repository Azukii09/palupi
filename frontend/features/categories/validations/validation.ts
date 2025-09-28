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
