import { BellIcon, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { todayDate } from "@/lib/utils";
import NavUser from "../nav-user";
import { Button } from "../ui/button";
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
                    <p className="text-muted-foreground text-xs">ou pressione</p>
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
          <h2 className="text-lg font-bold leading-tight text-foreground">
            Bem-vindo, {firstName}.
          </h2>
          <p className="text-xs text-muted-foreground capitalize">
            {todayDate}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-sm hidden md:block relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          className="pl-9 bg-muted/60 border-transparent focus-visible:border-input rounded-full"
          placeholder="Pesquisar..."
        />
      </div>

      {/* Actions */}
      {!isMobile && (
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="secondary" size="icon">
            <BellIcon className="size-5 text-muted-foreground" />
          </Button>

          <NavUser />
        </div>
      )}
    </header>
  );
};

export default Header;
