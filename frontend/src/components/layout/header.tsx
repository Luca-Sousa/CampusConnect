import { BellIcon, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { todayDate } from "@/lib/utils";
import NavUser from "../nav-user";
import { Button } from "../ui/button";

const Header = () => {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b bg-sidebar px-6 gap-6">
      {/* Welcome */}
      <div className="min-w-0 shrink-0">
        <h2 className="text-lg font-bold leading-tight text-foreground">
          Bem-vindo, Lucas.
        </h2>
        <p className="text-xs text-muted-foreground capitalize">{todayDate}</p>
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
      <div className="flex items-center gap-2 shrink-0">
        <Button variant="secondary" size="icon">
          <BellIcon className="size-5 text-muted-foreground" />
        </Button>

        <NavUser
          user={{
            name: "Lucas Almeida",
            email: "lucas.almeida@example.com",
            avatar: "https://github.com/shadcn.png",
          }}
        />
      </div>
    </header>
  );
};

export default Header;
