"use client";

import { type ColumnDef } from "@tanstack/react-table";

type Expense = {
  user: {
    id: string;
    name: string | null;
    email: string;
    emailVerified: Date | null;
    image: string | null;
  } | null;
  expense: {
    id: number;
    createdAt: Date;
    description: string | null;
    groupId: number;
    amount: number;
    paidById: string;
  };
};

const ExpensesTableColumns: ColumnDef<Expense>[] = [
  {
    header: "Description",
    accessorKey: "expense.description",
  },
  {
    header: "Created By",
    accessorKey: "user.name",
  },
  {
    header: "Created At",
    accessorKey: "expense.createdAt",
    cell: ({ getValue }) => {
      const date = getValue() as Date;
      return date.toLocaleDateString();
    },
  },
];

export default ExpensesTableColumns;
