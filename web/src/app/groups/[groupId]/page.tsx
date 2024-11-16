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
import {
  ArrowLeftRight,
  ArrowRightLeft,
  Loader,
  RefreshCcw,
} from "lucide-react";
import TransactionsTable from "./TransactionsTable";
import { Button } from "@/components/ui/button";

export default async function GroupPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const groupId = (await params).groupId;

  const session = await auth();

  if (session?.user) {
    void api.group.getGroup.prefetch({ id: parseInt(groupId) });
    void api.group.getMembers.prefetch({ id: parseInt(groupId) });
    void api.group.getExpenses.prefetch({ id: parseInt(groupId) });
  }

  if (!groupId) {
    return <Loader />;
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
      <div className="flex h-full max-h-full flex-col justify-between gap-0 space-y-2 sm:flex-row sm:gap-4 sm:space-y-0">
        <div className="flex h-full w-full flex-col space-y-2 sm:w-2/3 sm:space-y-4">
          <div className="flex flex-col justify-between space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Card className="h-fit w-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Total Spent</CardTitle>
                <ArrowLeftRight className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">2000</p>
              </CardContent>
            </Card>

            <Card className="h-fit w-full">
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
            <CardHeader className="flex flex-row justify-between">
              <div className="flex flex-col">
                <CardTitle>Expenses</CardTitle>
                <CardDescription>
                  All expenses added to{" "}
                  <span className="font-semibold text-neutral-900 dark:text-neutral-300">
                    {groupData[0]?.group?.name}
                  </span>
                  .
                </CardDescription>
              </div>
              <Button variant="ghost" size="icon">
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {session?.user && (
                <TransactionsTable groupId={parseInt(groupId)} />
              )}
            </CardContent>
          </Card>
        </div>
        {session?.user && <GroupMembers groupId={parseInt(groupId)} />}
      </div>
    </div>
  );
}
