import { useState } from "react";
import { PlusIcon, SearchIcon, UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "@/lib/auth-client";
import { GroupCard } from "@/features/groups/components/GroupCard";
import { GroupForm } from "@/features/groups/components/GroupForm";
import { GroupSheet } from "@/features/groups/components/GroupSheet";
import { GroupListSkeleton } from "@/features/groups/components/GroupListSkeleton";
import { useGroups } from "@/features/groups/hooks/use-groups";
import type { Group } from "@/features/groups/types";

const GroupsPage = () => {
  const { data: session } = useSession();
  const { data: groups, isLoading, search, setSearch } = useGroups();

  const [formOpen, setFormOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  function handleEdit(group: Group) {
    setEditingGroup(group);
    setFormOpen(true);
  }

  function handleOpenCreate() {
    setEditingGroup(null);
    setFormOpen(true);
  }

  function handleOpenMessages(group: Group) {
    setSelectedGroup(group);
    setSheetOpen(true);
  }

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
         <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
              <UsersIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Grupos</h1>
              <p className="text-sm text-muted-foreground">
                Encontre e entre em grupos da comunidade
              </p>
            </div>
          </div>
          <Button
            onClick={handleOpenCreate}
            className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Novo Grupo
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar grupos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Content */}
        {isLoading ? (
          <GroupListSkeleton />
        ) : groups && groups.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {groups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                currentUserId={session?.user.id}
                userRole={(session?.user as Record<string, unknown>).role as string}
                onEdit={handleEdit}
                onOpenMessages={handleOpenMessages}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-4">
              <UsersIcon className="h-8 w-8 text-indigo-500" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Nenhum grupo encontrado
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {search
                ? "Tente buscar com outros termos."
                : "Seja o primeiro a criar um grupo!"}
            </p>
          </div>
        )}
      </div>

      {/* Form dialog */}
      <GroupForm
        open={formOpen}
        onOpenChange={setFormOpen}
        editingGroup={editingGroup}
      />

      {/* Messages sheet */}
      <GroupSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        group={selectedGroup}
        currentUserId={session?.user.id}
      />
    </div>
  );
};

export default GroupsPage;
