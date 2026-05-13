import * as React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// ---- Data ----------------------------------------------------------------
const pages = [
  {
    id: 1,
    name: "Dev Campus",
    initials: "DC",
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: 2,
    name: "Rifiu Team",
    initials: "RT",
    color: "bg-purple-100 text-purple-600",
  },
];

const contacts = [
  {
    id: 1,
    name: "Ana Paula",
    initials: "AP",
    color: "bg-pink-100 text-pink-600",
    online: true,
  },
  {
    id: 2,
    name: "João Pedro",
    initials: "JP",
    color: "bg-green-100 text-green-600",
    online: true,
  },
  {
    id: 3,
    name: "Maria Silva",
    initials: "MS",
    color: "bg-amber-100 text-amber-600",
    online: true,
  },
  {
    id: 4,
    name: "Carlos Lima",
    initials: "CL",
    color: "bg-teal-100 text-teal-600",
    online: false,
  },
];

const groups = [
  {
    id: 1,
    name: "Eng. de Software",
    initials: "ES",
    color: "bg-indigo-100 text-indigo-600",
    online: true,
  },
  {
    id: 2,
    name: "Dev Web",
    initials: "DW",
    color: "bg-rose-100 text-rose-600",
    online: true,
  },
];

// ---- Sub-components -------------------------------------------------------
interface ContactItemProps {
  name: string;
  initials: string;
  color: string;
  online?: boolean;
}

const ContactItem = ({ name, initials, color, online }: ContactItemProps) => (
  <SidebarMenuItem>
    <SidebarMenuButton className="h-auto py-1.5 gap-3">
      <div className="relative shrink-0">
        <Avatar className="h-7 w-7">
          <AvatarFallback className={`text-xs font-semibold ${color}`}>
            {initials}
          </AvatarFallback>
        </Avatar>
        {online !== undefined && (
          <span
            className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-2 border-sidebar ${
              online ? "bg-green-500" : "bg-muted-foreground/30"
            }`}
          />
        )}
      </div>
      <span className="text-sm font-medium">{name}</span>
    </SidebarMenuButton>
  </SidebarMenuItem>
);

// ---- Main component -------------------------------------------------------
const SidebarRight = () => {
  return (
    <Sidebar
      collapsible="none"
      side="right"
      className="border-l"
      style={{ "--sidebar-width": "19.5rem" } as React.CSSProperties}
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Suas Páginas</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {pages.map((p) => (
                <ContactItem key={p.id} {...p} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Contatos</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contacts.map((c) => (
                <ContactItem key={c.id} {...c} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Grupos</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {groups.map((g) => (
                <ContactItem key={g.id} {...g} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SidebarRight;
