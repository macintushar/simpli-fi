"use client";

import { DataTable } from "@/components/DataTable";
import { api } from "@/trpc/react";

import { Button } from "@/components/ui/button";
import { type ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { ArrowUpDown } from "lucide-react";

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

type ExpensesTableProps = {
  groupId: number;
};

const ExpensesTableColumns: ColumnDef<Expense>[] = [
  {
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-1 font-semibold">
          Added On
          <Button
            variant="ghost"
            size="icon"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      );
    },
    accessorKey: "expense.createdAt",
    cell: ({ getValue }) => {
      const date = getValue() as Date;
      return <h1>{dayjs(date).format("DD/MM/YYYY [at] hh:mm A")}</h1>;
    },
  },
  {
    header: "Description",
    accessorKey: "expense.description",
  },
  {
    header: "Amount",
    accessorKey: "expense.amount",
  },
  {
    header: "Created By",
    accessorKey: "user.name",
  },
];

export default function ExpensesTable({ groupId }: ExpensesTableProps) {
  const expensesData = api.group.getExpenses.useSuspenseQuery({ id: groupId });
  return <DataTable columns={ExpensesTableColumns} data={expensesData[0]} />;
}
