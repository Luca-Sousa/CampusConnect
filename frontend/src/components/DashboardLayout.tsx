import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SidebarLeft } from "@/components/sidebar-left";
import { SidebarRight } from "@/components/sidebar-right";
import AppHeader from "@/components/AppHeader";
import { ScrollArea } from "@/components/ui/scroll-area";

const DashboardLayout = () => {
  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <SidebarLeft />
      <SidebarInset className="overflow-hidden">
        <AppHeader />
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <ScrollArea className="flex-1">
            <main className="flex flex-col">
              <Outlet />
            </main>
          </ScrollArea>
          <SidebarRight />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
