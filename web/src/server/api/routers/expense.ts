import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { expenses } from "@/server/db/schema";
import { addExpenseSchema } from "./schemas";

export const expenseRouter = createTRPCRouter({
  addExpense: protectedProcedure
    .input(addExpenseSchema)
    .mutation(async ({ ctx, input }) => {
      const amount = parseInt(input.amount);
      const expenseData = await ctx.db
        .insert(expenses)
        .values({
          groupId: input.groupId,
          description: input.description,
          amount: amount,
          paidById: input.paidById,
        })
        .returning();

      return expenseData;
    }),
});
