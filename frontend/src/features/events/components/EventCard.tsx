import { MapPinIcon, CalendarIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Event } from "../types";

const categoryLabel: Record<Event["category"], string> = {
  palestra: "Palestra",
  workshop: "Workshop",
  "seminário": "Seminário",
  outro: "Outro",
};

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-snug">{event.title}</CardTitle>
          <Badge variant="secondary" className="shrink-0">
            {categoryLabel[event.category]}
          </Badge>
        </div>
        <CardDescription>{event.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarIcon className="h-4 w-4 shrink-0" />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPinIcon className="h-4 w-4 shrink-0" />
          <span>{event.location}</span>
        </div>
      </CardContent>
    </Card>
  );
}
