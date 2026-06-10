import { todayDate } from "@/lib/utils";
import NavUser from "../nav-user";
import { NotificationPopover } from "../notification-popover";
import { SidebarTrigger, useSidebar } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Kbd, KbdGroup } from "../ui/kbd";
import { useSession } from "@/lib/auth-client";

const Header = () => {
  const { open, isMobile } = useSidebar();
  const { data: session } = useSession();
  const firstName = session?.user.name.split(" ")[0] ?? "";

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b bg-sidebar px-4 lg:px-6 gap-6">
      <div className="flex items-center justify-center gap-3 lg:gap-6">
        <div className="flex gap-3">
          {!isMobile ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarTrigger />
              </TooltipTrigger>
              <TooltipContent>
                {open ? (
                  <div className="flex flex-col items-center gap-1">
                    <p>Ocultar Sidebar</p>
                    <p className="text-muted-foreground text-xs">
                      ou pressione
                    </p>
                    <KbdGroup>
                      <Kbd>Ctrl</Kbd>
                      <span>+</span>
                      <Kbd>B</Kbd>
                    </KbdGroup>
                  </div>
                ) : (
                  <p>Mostrar Sidebar</p>
                )}
              </TooltipContent>
            </Tooltip>
          ) : (
            <SidebarTrigger />
          )}
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-8"
          />
        </div>

        {/* Welcome */}
        <div className="min-w-0 shrink-0">
          <h2 className="text-md lg:text-lg font-bold leading-tight text-foreground">
            Bem-vindo, {firstName}.
          </h2>
          <p className="text-xs text-muted-foreground capitalize">
            {todayDate()}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <NotificationPopover />

        {!isMobile && <NavUser />}
      </div>
    </header>
  );
};

export default Header;
