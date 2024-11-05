import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { api } from "@/trpc/server";

type GroupMembersProps = {
  groupId: number;
};

function MemberItem({
  name,
  image,
  totalSpent,
  totalBalance,
}: {
  name: string;
  image: string;
  totalSpent: number;
  totalBalance: number;
}) {
  return (
    <div className="flex items-center justify-between gap-1">
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8 rounded-full">
          <AvatarImage src={image} alt={name} />
          <AvatarFallback className="rounded-full" />
        </Avatar>
        <div className="flex flex-col">
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs font-light">
            Total Spent: <span className="font-semibold">{totalSpent}</span>
          </p>
        </div>
      </div>
      <p className="text-sm font-semibold">{totalBalance}</p>
    </div>
  );
}

export default async function GroupMembers({ groupId }: GroupMembersProps) {
  const membersData = await api.group.getMembers({ id: groupId });
  return (
    <Card className="h-fit w-[300px]">
      <CardHeader>
        <h1 className="text-xl font-semibold">Members</h1>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {membersData.map((member) => (
            <MemberItem
              key={member.group_membership.userId}
              name={member.user?.name || "User"}
              image={member.user?.image || ""}
              totalSpent={100}
              totalBalance={1000}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
