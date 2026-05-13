import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SidebarLeft } from "@/components/layout/sidebar-left";
import { SidebarRight } from "@/components/layout/sidebar-right";
import Header from "@/components/layout/header";
import { ScrollArea } from "@/components/ui/scroll-area";

const Layout = () => {
  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <SidebarLeft />
      <SidebarInset className="overflow-hidden">
        <Header />
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

export default Layout;
