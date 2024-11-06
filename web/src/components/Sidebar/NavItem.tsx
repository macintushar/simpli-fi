"use client";

import { SidebarMenuButton } from "@/components/ui/sidebar";
import Link from "next/link";

import { usePathname } from "next/navigation";

type NavItemProps = {
  name: string;
  url: string;
  icon: React.ReactNode;
};

export default function NavItem({ name, url, icon }: NavItemProps) {
  const path = usePathname();
  console.log(path);

  return (
    <SidebarMenuButton isActive={path === url} asChild>
      <Link href={url}>
        {icon}
        <span>{name}</span>
      </Link>
    </SidebarMenuButton>
  );
}
