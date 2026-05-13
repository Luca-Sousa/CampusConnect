import { GroupCard } from "@/features/groups/components/GroupCard";
import { mockGroups } from "@/features/groups/data";

const GroupsPage = () => {
  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">Grupos</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mockGroups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupsPage;
