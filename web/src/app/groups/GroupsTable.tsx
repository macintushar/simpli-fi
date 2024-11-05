"use client";

import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

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
      return date.toLocaleDateString();
    },
  },
];

export default function GroupsTable({ data }: { data: Groups[] }) {
  const router = useRouter();

  return (
    <DataTable
      columns={GroupsTableColumns}
      data={data}
      onRowClick={(row) => router.push(`/groups/${row.group.id}`)}
    />
  );
}
