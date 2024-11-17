import { z } from "zod";

export const addExpenseSchema = z.object({
  groupId: z.number().min(1),
  amount: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
    message: "Expected number, received a string",
  }),
  description: z.string().min(1),
  paidById: z.string(),
  splitWithUserId: z.array(z.string()),
});

export const createGroupSchema = z.object({
  name: z.string().min(1),
});
