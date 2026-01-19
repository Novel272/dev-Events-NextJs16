import { Suspense } from "react";
import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { EventAttrs } from "@/database";

// Async server component responsible for data fetching, rendered within Suspense
async function EventsSection() {
  const response = await fetch(`/api/events`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`);
  }

  const { events } = await response.json();

  return (
    <ul className="events">
      {events &&
        events.length > 0 &&
        events
          .filter((event: EventAttrs) => event.slug)
          .map((event: EventAttrs, index: number) => (
            <li key={event.slug || `event-${index}`} className="list-none">
              <EventCard {...event} slug={event.slug || ""} />
            </li>
          ))}
    </ul>
  );
}

function EventsFallback() {
  return (
    <ul className="events">
      {/* Simple fallback skeletons */}
      {Array.from({ length: 3 }).map((_, i) => (
        <li key={`skeleton-${i}`} className="list-none">
          <div className="w-[410px] h-[300px] bg-gray-200/40 animate-pulse rounded-md" />
          <div className="mt-3 h-4 w-1/2 bg-gray-200/40 animate-pulse rounded" />
          <div className="mt-2 h-6 w-3/4 bg-gray-200/40 animate-pulse rounded" />
          <div className="mt-2 flex gap-4">
            <div className="h-4 w-24 bg-gray-200/40 animate-pulse rounded" />
            <div className="h-4 w-24 bg-gray-200/40 animate-pulse rounded" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function Page() {
  return (
    <section>
      <h1 className="text-center">
        The Hub For Every <br /> Event You Can't Miss
      </h1>
      <p className="text-center mt-5">Hackathons , Meetups, And Conference, All In One Place</p>
      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <Suspense fallback={<EventsFallback />}>
          {/* The async data read is inside this component, safely wrapped in Suspense */}
          {/* @ts-expect-error Async Server Component */}
          <EventsSection />
        </Suspense>
      </div>
    </section>
  );
}
