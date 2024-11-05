import TitleBar from "@/components/TitleBar";
import { api } from "@/trpc/server";
import CreateGroupDialog from "./CreateGroupDialog";
import GroupsTable from "./GroupsTable";
import { Card } from "@/components/ui/card";

export default async function GroupsPage() {
  const groups = await api.group.getGroups();

  return (
    <div className="flex flex-col gap-4">
      <TitleBar title={`Groups`} extra={<CreateGroupDialog />} />
      <Card className="h-fit p-2">
        <GroupsTable data={groups} />
      </Card>
    </div>
  );
}
