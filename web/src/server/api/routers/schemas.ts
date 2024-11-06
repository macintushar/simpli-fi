import { z } from "zod";

export const addExpenseSchema = z.object({
  groupId: z.number().min(1),
  amount: z.number().min(1),
  description: z.string().min(1),
  paidById: z.string(),
});
