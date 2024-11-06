import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";

export default function AvatarPicture({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <Avatar className={cn("h-8 w-8 rounded-full", className)}>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback className="rounded-full">
        <User className="h-4 w-4" />
      </AvatarFallback>
    </Avatar>
  );
}
