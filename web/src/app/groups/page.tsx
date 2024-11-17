import TitleBar from "@/components/TitleBar";
import { api } from "@/trpc/server";
import CreateGroupDialog from "./CreateGroupDialog";
import GroupsTable from "./GroupsTable";
import { Card } from "@/components/ui/card";
import { auth } from "@/server/auth";

export default async function GroupsPage() {
  const session = await auth();

  if (session?.user) {
    void api.group.getGroups.prefetch();
  }

  return (
    <div className="flex flex-col gap-4">
      <TitleBar title={`Groups`} extra={<CreateGroupDialog />} />
      <Card className="h-fit p-2">
        {session?.user && <GroupsTable currentUser={session.user} />}
      </Card>
    </div>
  );
}
