"use client";

import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { api } from "@/trpc/react";

type Groups = {
  group: {
    id: number;
    name: string;
    createdById: string;
    createdAt: Date;
    description: string | null;
  };
  user: {
    id: string;
    name: string | null;
    email: string;
    emailVerified: Date | null;
    image: string | null;
  } | null;
  group_membership: { userId: string; groupId: number; joinedAt: Date } | null;
};

const GroupsTableColumns: ColumnDef<Groups>[] = [
  {
    header: "Name",
    accessorKey: "group.name",
  },
  {
    header: "Created By",
    accessorKey: "user.name",
  },
  {
    header: "Created At",
    accessorKey: "group.createdAt",
    cell: ({ getValue }) => {
      const date = getValue() as Date;
      return <h1>{dayjs(date).format("DD/MM/YYYY")}</h1>;
    },
  },
  {
    accessorKey: "group_membership.joinedAt",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-1 font-semibold">
          Joined On
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
    cell: ({ getValue }) => {
      const date = getValue() as Date;
      return <h1>{dayjs(date).format("DD/MM/YYYY [at] hh:mm A")}</h1>;
    },
  },
];

export default function GroupsTable() {
  const router = useRouter();
  const groups = api.group.getGroups.useSuspenseQuery();

  return (
    <DataTable
      columns={GroupsTableColumns}
      data={groups[0]}
      onRowClick={(row) => router.push(`/groups/${row.group.id}`)}
    />
  );
}
