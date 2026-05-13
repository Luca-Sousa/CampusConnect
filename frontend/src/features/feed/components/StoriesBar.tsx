import { PlusIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Story } from "../types";
import { mockStories } from "../data";

interface StoryCardProps {
  story: Story;
}

function StoryCard({ story }: StoryCardProps) {
  return (
    <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group select-none">
      <div
        className={`h-18 w-18 rounded-full bg-linear-to-br ${story.from} ${story.to} flex items-center justify-center shadow ring-[3px] ring-white group-hover:scale-105 transition-transform`}
      >
        <span className="text-white font-bold text-base drop-shadow">{story.initials}</span>
      </div>
      <span className="text-xs text-muted-foreground font-medium">{story.name}</span>
    </div>
  );
}

interface StoriesBarProps {
  stories?: Story[];
}

export function StoriesBar({ stories = mockStories }: StoriesBarProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-end gap-5 overflow-x-auto pb-1 scrollbar-hide">
          <div className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group select-none">
            <div className="h-18 w-18 rounded-full bg-orange-50 border-2 border-dashed border-orange-300 flex items-center justify-center">
              <div className="h-7 w-7 rounded-full bg-orange-400 flex items-center justify-center shadow">
                <PlusIcon className="h-4 w-4 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <span className="text-xs text-muted-foreground font-medium text-center leading-tight">
              Criar Story
            </span>
          </div>
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
