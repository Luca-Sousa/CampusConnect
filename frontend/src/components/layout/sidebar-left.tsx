"use client";

import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "@/lib/auth-client";
import {
  HomeIcon,
  NewspaperIcon,
  CalendarDaysIcon,
  UserRoundIcon,
  HelpCircleIcon,
  LogOutIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Feed", url: "/", icon: HomeIcon },
  { title: "Eventos", url: "/events", icon: CalendarDaysIcon },
  { title: "Notícias", url: "/news", icon: NewspaperIcon },
  { title: "Grupos", url: "/groups", icon: UserRoundIcon },
];

const navBottom = [
  { title: "Ajuda", url: "/help", icon: HelpCircleIcon },
];

const SidebarLeft = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/signin");
  };

  return (
    <Sidebar className="border-r" {...props}>
      {/* Logo */}
      <SidebarHeader className="h-16 border-b border-sidebar-border flex justify-center px-4">
        <Link to="/" className="flex items-center gap-3 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-orange-400 to-rose-500 shadow-sm shrink-0">
            <span className="text-white font-bold text-sm tracking-tight">
              CC
            </span>
          </div>
          <span className="font-semibold text-foreground text-base tracking-tight">
            CampusConnect
          </span>
        </Link>
      </SidebarHeader>

      {/* Nav principal */}
      <SidebarContent className="pt-6 px-2">
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive =
              item.url === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.url);
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.title}
                  className="gap-3 px-4 py-2.5 h-auto"
                >
                  <Link to={item.url}>
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span className="text-sm font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Help + Logout */}
      <SidebarFooter className="pb-6 border-t">
        <SidebarMenu>
          {navBottom.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className="gap-3 px-4 py-2.5 h-auto text-muted-foreground hover:text-foreground"
              >
                <Link to={item.url}>
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span className="text-sm font-medium">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              tooltip="Sair"
              className="gap-3 px-4 py-2.5 h-auto text-muted-foreground hover:text-foreground"
            >
              <LogOutIcon className="h-5 w-5 shrink-0" />
              <span className="text-sm font-medium">Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarLeft;
