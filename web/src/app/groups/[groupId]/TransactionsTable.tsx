"use client";

import { DataTable } from "@/components/DataTable";
import { api } from "@/trpc/react";

import { Button } from "@/components/ui/button";
import { type ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { ArrowUpDown } from "lucide-react";
import AvatarTableItem from "@/components/AvatarTableItem";
import { type User } from "next-auth";

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
  currentUser: User;
};

export default function ExpensesTable({
  groupId,
  currentUser,
}: ExpensesTableProps) {
  const ExpensesTableColumns: ColumnDef<Expense>[] = [
    {
      header: ({ column }) => {
        return (
          <div className="flex items-center gap-1 font-semibold">
            Added On
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
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
      header: "Added By",
      accessorKey: "user",
      cell: ({ getValue }) => {
        const user = getValue() as Expense["user"];
        return (
          <AvatarTableItem
            name={user?.name ?? "User"}
            image={user?.image ?? ""}
            currentUser={currentUser}
            userId={user?.id}
          />
        );
      },
    },
  ];

  const expensesData = api.group.getExpenses.useSuspenseQuery({ id: groupId });

  return <DataTable columns={ExpensesTableColumns} data={expensesData[0]} />;
}
