import { BellIcon, SearchIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

const AppHeader = () => {
  const today = new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b bg-sidebar px-6 gap-6">
      {/* Welcome */}
      <div className="min-w-0 shrink-0">
        <h2 className="text-lg font-bold leading-tight text-foreground">
          Bem-vindo, Lucas.
        </h2>
        <p className="text-xs text-muted-foreground capitalize">{today}</p>
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
        <button className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition-colors">
          <BellIcon className="h-5 w-5 text-muted-foreground" />
        </button>
        <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-orange-200">
          <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold text-sm">
            LA
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default AppHeader;
