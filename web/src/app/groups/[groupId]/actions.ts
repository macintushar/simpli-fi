"use server";

import { auth } from "@/server/auth";
import { api } from "@/trpc/server";

export async function addExpense(
  groupId: number,
  amount: string,
  description: string,
) {
  const session = await auth();

  if (session?.user) {
    const addExpense = await api.expense.addExpense({
      groupId: groupId,
      amount: amount,
      description: description,
      paidById: session.user.id,
    });
    return addExpense;
  }
}
