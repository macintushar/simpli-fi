import TitleBar from "@/components/TitleBar";
import { auth } from "@/server/auth";
import { api } from "@/trpc/server";
import AddGroupExpenseDialog from "./AddGroupExpenseDialog";
import GroupMembers from "./GroupMembers";

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

  const groupData = await api.group.getGroup({ id: parseInt(groupId) });

  return (
    <div className="flex h-full flex-col gap-4">
      <TitleBar
        title={`Group / ${groupData[0]?.group?.name}`}
        subtitle={`Created by ${groupData[0]?.group?.createdById}`}
        extra={
          <AddGroupExpenseDialog
            groupName={groupData[0]?.group?.name ?? "your group"}
          />
        }
      />
      <div className="flex h-full justify-between">
        <h1>ds</h1>
        <GroupMembers groupId={parseInt(groupId)} />
      </div>
    </div>
  );
}
