import TitleBar from "@/components/TitleBar";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import AddGroupExpenseDialog from "./AddGroupExpenseDialog";
import GroupMembers from "./GroupMembers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeftRight, ArrowRightLeft, Loader } from "lucide-react";
import TransactionsTable from "./TransactionsTable";

export default async function GroupPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const groupId = (await params).groupId;

  const session = await auth();

  if (!session?.user) {
    return <div>You need to be logged in to view this page.</div>;
  }

  if (!groupId) {
    <Loader />;
  }

  const groupData = await api.group.getGroup({ id: parseInt(groupId) });

  return (
    <div className="flex h-full max-h-screen flex-col gap-4">
      <TitleBar
        title={`Group / ${groupData[0]?.group?.name}`}
        subtitle={`Created by ${groupData[0]?.group?.createdById}`}
        extra={
          <AddGroupExpenseDialog
            groupName={groupData[0]?.group?.name ?? "your group"}
            groupId={parseInt(groupId)}
          />
        }
      />
      <div className="flex h-full max-h-full flex-col justify-between sm:flex-row">
        <div className="flex h-full w-full flex-col space-y-2 sm:space-y-4">
          <div className="flex flex-wrap justify-between space-y-2 sm:space-y-0">
            <Card className="h-fit w-[300px]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Total Spent</CardTitle>
                <ArrowLeftRight className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">2000</p>
              </CardContent>
            </Card>

            <Card className="h-fit w-[300px]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Total Owed</CardTitle>
                <ArrowRightLeft className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">1800</p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Expenses</CardTitle>
              <CardDescription>
                All expenses added to{" "}
                <span className="font-semibold text-neutral-900 dark:text-neutral-300">
                  {groupData[0]?.group?.name}
                </span>
                .
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionsTable groupId={parseInt(groupId)} />
            </CardContent>
          </Card>
        </div>
        <GroupMembers groupId={parseInt(groupId)} />
      </div>
    </div>
  );
}
