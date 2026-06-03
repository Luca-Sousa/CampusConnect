import { useState } from "react";
import {
  CalendarDaysIcon,
  SparklesIcon,
  CalendarXIcon,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useEvents } from "@/features/events/hooks/use-events";
import { EventComposer } from "@/features/events/components/EventComposer";
import { EventCard } from "@/features/events/components/EventCard";
import { EventListSkeleton } from "@/features/events/components/EventListSkeleton";
import type { EventPost } from "@/features/events/types";

const EventsPage = () => {
  const { data: session } = useSession();
  const { data: events = [], isLoading } = useEvents();
  const [editingEvent, setEditingEvent] = useState<EventPost | null>(null);

  const upcomingEvents = events.filter(
    (e) => new Date(`${e.eventDate}T${e.eventTime}`) >= new Date(),
  );
  const pastEvents = events.filter(
    (e) => new Date(`${e.eventDate}T${e.eventTime}`) < new Date(),
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-100 dark:bg-emerald-900/30 p-2.5">
              <CalendarDaysIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Eventos</h1>
              <p className="text-xs text-muted-foreground">
                {events.length} evento{events.length !== 1 ? "s" : ""} no campus
              </p>
            </div>
          </div>
          <EventComposer
            editingEvent={editingEvent}
            onEditClose={() => setEditingEvent(null)}
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {isLoading ? (
          <EventListSkeleton />
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 p-6 mb-5">
              <CalendarXIcon className="h-12 w-12 text-emerald-400 dark:text-emerald-500" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Nenhum evento encontrado
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Seja o primeiro a criar um evento e compartilhe com a comunidade do campus.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Upcoming events */}
            {upcomingEvents.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <SparklesIcon className="h-4 w-4 text-emerald-500" />
                  <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                    Próximos eventos
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    ({upcomingEvents.length})
                  </span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {upcomingEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      currentUserId={session?.user?.id}
                      onEdit={setEditingEvent}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Past events */}
            {pastEvents.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Eventos encerrados
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    ({pastEvents.length})
                  </span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 opacity-75">
                  {pastEvents.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      currentUserId={session?.user?.id}
                      onEdit={setEditingEvent}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
