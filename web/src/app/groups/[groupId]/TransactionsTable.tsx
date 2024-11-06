import { DataTable } from "@/components/DataTable";
import { api } from "@/trpc/server";
import ExpensesTableColumns from "./ExpensesTableColumns";

type ExpensesTableProps = {
  groupId: number;
};

export default async function ExpensesTable({ groupId }: ExpensesTableProps) {
  const expensesData = await api.group.getExpenses({ id: groupId });
  return <DataTable columns={ExpensesTableColumns} data={expensesData} />;
}
