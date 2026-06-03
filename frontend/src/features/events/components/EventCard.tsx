import {
  CalendarIcon,
  CheckCircle2Icon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  formatEventTimeRange,
  formatRelativeTime,
  getInitials,
  isEventInPast,
} from "@/features/feed/utils/format";
import { useToggleRsvp } from "../hooks/use-toggle-rsvp";
import type { EventPost } from "../types";
import { EventActionsMenu } from "./EventActionsMenu";

interface EventCardProps {
  event: EventPost;
  currentUserId?: string;
  onEdit: (event: EventPost) => void;
}

export function EventCard({ event, currentUserId, onEdit }: EventCardProps) {
  const { mutate: toggleRsvp, isPending } = useToggleRsvp();

  const authorName = event.author?.name ?? "Usuário";
  const isAuthor = currentUserId === event.authorId;
  const inPast = isEventInPast(event);

  const initials = getInitials(authorName);

  return (
    <article className="group relative rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-700">
      {/* Image section with date badge overlay */}
      <div className="relative aspect-video overflow-hidden bg-linear-to-br from-emerald-500 to-teal-600">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.eventTitle}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <CalendarIcon className="h-16 w-16 text-white/30" />
          </div>
        )}

        {/* Date badge overlay */}
        <div className="absolute top-3 left-3 flex flex-col items-center rounded-xl bg-white/95 dark:bg-black/90 backdrop-blur-sm px-3 py-2 shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            {new Date(event.eventDate + "T12:00:00").toLocaleDateString("pt-BR", { month: "short" })}
          </span>
          <span className="text-2xl font-extrabold text-foreground leading-none">
            {new Date(event.eventDate + "T12:00:00").getDate()}
          </span>
        </div>

        {/* Past badge */}
        {inPast && (
          <div className="absolute top-3 right-3 rounded-full bg-black/70 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white">
            Encerrado
          </div>
        )}

        {/* Actions menu for author — sempre visível para o autor.
            O EventActionsMenu internamente desabilita "Editar" em eventos passados. */}
        {isAuthor && (
          <div className="absolute top-3 right-3">
            <EventActionsMenu event={event} onEdit={onEdit} variant="banner" />
          </div>
        )}
      </div>

      {/* Content section */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-bold text-lg leading-snug text-foreground line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          {event.eventTitle}
        </h3>

        {/* Metadata chips */}
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <ClockIcon className="h-3.5 w-3.5 text-emerald-500" />
            {formatEventTimeRange(event.eventTime, event.eventEndTime)}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPinIcon className="h-3.5 w-3.5 text-emerald-500" />
            <span className="truncate max-w-45">{event.eventLocation}</span>
          </span>
        </div>

        {/* Description preview */}
        {event.content && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {event.content}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          {/* Author */}
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-foreground leading-tight">
                {authorName}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {formatRelativeTime(event.createdAt)}
              </span>
            </div>
          </div>

          {/* RSVP section */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <UsersIcon className="h-3.5 w-3.5" />
              {event.rsvpCount}
            </span>
            <Button
              size="sm"
              variant={event.hasRsvp ? "default" : "outline"}
              className={`h-8 gap-1.5 text-xs ${
                event.hasRsvp
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white border-transparent"
                  : "border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
              }`}
              disabled={isPending}
              onClick={() => toggleRsvp(event.id)}
            >
              <CheckCircle2Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">
                {event.hasRsvp ? "Confirmado" : "Confirmar"}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
