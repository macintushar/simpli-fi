import { type User } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function AvatarTableItem({
  name,
  image,
  currentUser,
  userId,
}: {
  name: string;
  image: string;
  currentUser?: User;
  userId?: string;
}) {
  const isCurrentUser = currentUser?.id === userId || false;
  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-6 w-6">
        <AvatarImage src={image} alt={name} />
        <AvatarFallback>{name}</AvatarFallback>
      </Avatar>
      <h1>{isCurrentUser ? `${name} (you)` : name}</h1>
    </div>
  );
}
