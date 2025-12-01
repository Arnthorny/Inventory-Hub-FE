import { z } from "zod"

export const createItemSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string(),
  category: z.string().min(4, "Category is required"),
  level: z.enum(["guest", "intern", "staff", "admin"]),
  location: z.string(),
  available: z.coerce.number().min(0),
  in_use: z.coerce.number().min(0),
  damaged: z.coerce.number().min(0),
  total: z.coerce.number().min(0),
}).refine((data) => {

  const calculatedTotal = data.available + data.in_use + data.damaged
  return data.total === calculatedTotal
}, {
  message: "Total must equal the sum of Available, In Use, and Damaged",
  path: ["total"]
})

export type CreateItemFormValues = z.infer<typeof createItemSchema>