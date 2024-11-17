import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { balances, expenses } from "@/server/db/schema";
import { addExpenseSchema } from "./schemas";
import { sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const expenseRouter = createTRPCRouter({
  addExpense: protectedProcedure
    .input(addExpenseSchema)
    .mutation(async ({ ctx, input }) => {
      const amount = parseInt(input.amount);

      // Validate amount
      if (isNaN(amount) || amount <= 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid amount",
        });
      }

      // Calculate split
      const totalParticipants = input.splitWithUserId.length + 1; // +1 for payer
      const amountPerPerson = Math.floor(amount / totalParticipants);

      return await ctx.db.transaction(async (tx) => {
        // 1. Create expense record
        const [expense] = await tx
          .insert(expenses)
          .values({
            groupId: input.groupId,
            description: input.description,
            amount: amount,
            paidById: input.paidById,
          })
          .returning();

        // 2. Update payer's balance (credit them the amount minus their share)
        const payerCredit = amount - amountPerPerson;
        await tx
          .insert(balances)
          .values({
            groupId: input.groupId,
            userId: input.paidById,
            balance: payerCredit,
          })
          .onConflictDoUpdate({
            target: [balances.groupId, balances.userId],
            set: {
              balance: sql`${balances.balance} + ${payerCredit}`,
            },
          });

        // 3. Update balance for each person who owes money
        for (const debtorId of input.splitWithUserId) {
          await tx
            .insert(balances)
            .values({
              groupId: input.groupId,
              userId: debtorId,
              balance: -amountPerPerson,
            })
            .onConflictDoUpdate({
              target: [balances.groupId, balances.userId],
              set: {
                balance: sql`${balances.balance} - ${amountPerPerson}`,
              },
            });
        }

        return expense;
      });
    }),
});
