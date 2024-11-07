import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { api } from "@/trpc/server";
import AddMemeberDialog from "./AddMemberDialog";
import AvatarPicture from "@/components/AvatarPicture";

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
        <AvatarPicture src={image} alt={name} />
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
    <Card className="h-fit max-h-screen w-full overflow-clip sm:w-1/3">
      <CardHeader>
        <CardTitle>Members</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {membersData.map((member) => (
            <MemberItem
              key={member.group_membership.userId}
              name={member.user?.name ?? "User"}
              image={member.user?.image ?? ""}
              totalSpent={100}
              totalBalance={1000}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <AddMemeberDialog groupId={groupId} />
      </CardFooter>
    </Card>
  );
}
