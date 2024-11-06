import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import Profile from "./Profile";

import Logo from "@/assets/logo";
import { Home, Users } from "lucide-react";

import NavItem from "./NavItem";

const menuItems = [
  { name: "Home", url: "/", icon: <Home /> },
  { name: "Groups", url: "/groups", icon: <Users /> },
];

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="w-full px-3 py-1">
          <Logo />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((menuItem) => (
                <SidebarMenuItem key={menuItem.name}>
                  <NavItem
                    name={menuItem.name}
                    url={menuItem.url}
                    icon={menuItem.icon}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Profile />
      </SidebarFooter>
    </Sidebar>
  );
}
