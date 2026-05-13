import { EventCard } from "@/features/events/components/EventCard";
import { mockEvents } from "@/features/events/data";

const EventsPage = () => {
  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">Eventos</h1>
        <div className="flex flex-col gap-4">
          {mockEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
