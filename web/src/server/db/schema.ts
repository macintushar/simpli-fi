import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

export const createTable = pgTableCreator((name) => `simpli-fi_${name}`);

export const posts = createTable(
  "post",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }),
    createdById: varchar("created_by", { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    createdByIdIdx: index("created_by_idx").on(example.createdById),
    nameIndex: index("name_idx").on(example.name),
  }),
);

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export const groups = createTable(
  "group",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    createdById: varchar("created_by", { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (group) => ({
    createdByUserIdIdx: index("group_created_by_idx").on(group.createdById),
  }),
);

export const groupMemberships = createTable(
  "group_membership",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    groupId: integer("group_id")
      .notNull()
      .references(() => groups.id),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (membership) => ({
    primaryKey: primaryKey({
      columns: [membership.userId, membership.groupId],
    }),
    userIdIdx: index("group_membership_user_id_idx").on(membership.userId),
    groupIdIdx: index("group_membership_group_id_idx").on(membership.groupId),
  }),
);

export const expenses = createTable(
  "expense",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    groupId: integer("group_id")
      .notNull()
      .references(() => groups.id),
    amount: integer("amount").notNull(),
    description: text("description"),
    paidById: varchar("paid_by", { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (expense) => ({
    groupIdIdx: index("expense_group_id_idx").on(expense.groupId),
    paidByIdIdx: index("expense_paid_by_id_idx").on(expense.paidById),
  }),
);

export const balances = createTable(
  "balance",
  {
    groupId: integer("group_id")
      .notNull()
      .references(() => groups.id),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    balance: integer("balance").default(0).notNull(), // Negative means owed, positive means credit
  },
  (balance) => ({
    primaryKey: primaryKey({ columns: [balance.groupId, balance.userId] }),
    groupIdIdx: index("balance_group_id_idx").on(balance.groupId),
    userIdIdx: index("balance_user_id_idx").on(balance.userId),
  }),
);

export const groupsRelations = relations(groups, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [groups.createdById],
    references: [users.id],
  }),
  members: many(groupMemberships),
  expenses: many(expenses),
}));

export const groupMembershipsRelations = relations(
  groupMemberships,
  ({ one }) => ({
    user: one(users, {
      fields: [groupMemberships.userId],
      references: [users.id],
    }),
    group: one(groups, {
      fields: [groupMemberships.groupId],
      references: [groups.id],
    }),
  }),
);

export const balancesRelations = relations(balances, ({ one }) => ({
  group: one(groups, { fields: [balances.groupId], references: [groups.id] }),
  user: one(users, { fields: [balances.userId], references: [users.id] }),
}));

export const expensesRelations = relations(expenses, ({ one }) => ({
  group: one(groups, { fields: [expenses.groupId], references: [groups.id] }),
  paidBy: one(users, { fields: [expenses.paidById], references: [users.id] }),
}));
