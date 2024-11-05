import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { posts, groups, groupMemberships, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const groupRouter = createTRPCRouter({
  hello: publicProcedure.query(() => {
    return {
      greeting: `Groups`,
    };
  }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(posts).values({
        name: input.name,
        createdById: ctx.session.user.id,
      });
    }),

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

      if (groupData && groupData[0]) {
        const membershipData = await ctx.db.insert(groupMemberships).values({
          userId: ctx.session.user.id,
          groupId: groupData[0].id,
        });
      }

      return groupData;
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

      console.log(groupData, ctx.session.user.id);

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

      console.log(groupData, ctx.session.user.id);

      return groupData ?? null;
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
