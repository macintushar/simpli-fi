"use client";

import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { api } from "@/trpc/react";
import AvatarTableItem from "@/components/AvatarTableItem";
import { type User } from "next-auth";

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

export default function GroupsTable({ currentUser }: { currentUser: User }) {
  const router = useRouter();
  const groups = api.group.getGroups.useSuspenseQuery();

  const GroupsTableColumns: ColumnDef<Groups>[] = [
    {
      header: "Name",
      accessorKey: "group.name",
    },
    {
      header: "Created By",
      accessorKey: "user",
      cell: ({ getValue }) => {
        const user = getValue() as Groups["user"];
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
    {
      header: "Created At",
      accessorKey: "group.createdAt",
      cell: ({ getValue }) => {
        const date = getValue() as Date;
        return <h1>{dayjs(date).format("DD/MM/YYYY [at] hh:mm A")}</h1>;
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
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
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

  return (
    <DataTable
      columns={GroupsTableColumns}
      data={groups[0]}
      onRowClick={(row) => router.push(`/groups/${row.group.id}`)}
    />
  );
}
