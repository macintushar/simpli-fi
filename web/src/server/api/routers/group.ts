import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { groups, groupMemberships, users, expenses } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const groupRouter = createTRPCRouter({
  createGroup: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const groupData = await ctx.db
        .insert(groups)
        .values({
          name: input.name,
          createdById: ctx.session.user.id,
        })
        .returning();

      const membershipData = await ctx.db.insert(groupMemberships).values({
        userId: ctx.session.user.id,
        groupId: groupData[0]?.id ?? 0,
      });

      return membershipData;
    }),

  getGroups: protectedProcedure.query(async ({ ctx }) => {
    const allGroups = await ctx.db
      .select()
      .from(groups)
      .leftJoin(groupMemberships, eq(groups.id, groupMemberships.groupId))
      .leftJoin(users, eq(groups.createdById, users.id))
      .where(eq(groupMemberships.userId, ctx.session.user.id));
    return allGroups ?? null;
  }),

  getGroup: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const groupData = await ctx.db
        .select()
        .from(groups)
        .leftJoin(groupMemberships, eq(groups.id, groupMemberships.groupId))
        .where(eq(groups.id, input.id));

      return groupData ?? null;
    }),

  getMembers: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const groupData = await ctx.db
        .select()
        .from(groupMemberships)
        .leftJoin(users, eq(groupMemberships.userId, users.id))
        .where(eq(groupMemberships.groupId, input.id));

      return groupData ?? null;
    }),

  getExpenses: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const groupData = await ctx.db
        .select()
        .from(expenses)
        .leftJoin(users, eq(expenses.paidById, users.id))
        .where(eq(expenses.groupId, input.id));

      return groupData ?? null;
    }),
});
