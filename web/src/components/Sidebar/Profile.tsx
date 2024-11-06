import { ChevronsUpDown, LogOut, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/ModeToggle";

import { auth } from "@/server/auth";

import { redirect } from "next/navigation";
import Link from "next/link";
import AvatarPicture from "../AvatarPicture";

export default async function Profile() {
  const session = await auth();
  if (!session?.user) {
    redirect("/api/auth/signin");
  }
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            size="lg"
            className="w-full justify-between data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="flex items-center gap-1.5">
              <AvatarPicture
                src={session?.user?.image ?? ""}
                alt={session?.user?.name ?? "Name"}
              />
              <div className="flex flex-col items-start text-left">
                <span className="truncate text-sm font-semibold leading-none">
                  {session?.user?.name ?? "Name"}
                </span>
                <span className="mt-1 truncate text-xs leading-none text-sidebar-foreground/70">
                  {session?.user?.email ?? "mac@email.com"}
                </span>
              </div>
              <ChevronsUpDown className="mx-auto size-4" />
            </div>
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" side="top" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session?.user?.name ?? "Name"}
              </p>
              <p className="text-muted-foreground text-xs leading-none">
                {session?.user?.email ?? "mac@email.com"}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <ModeToggle />
          <DropdownMenuSeparator />
          <Link href="/api/auth/signout">
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
