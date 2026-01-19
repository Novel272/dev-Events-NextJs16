// /events/[slug]/page.tsx

import { notFound } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";
import BookEvent from "@/components/BookEvent";
import EventCard from "@/components/EventCard";
import { events } from "@/lib/constants";
import { EventAttrs } from "@/database";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import { cacheLife } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailedItem = ({ icon, alt, label }: { icon: string; alt: string; label: string }) => (
  <div className="flex-row-gap-2 items-center">
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
);

const EventAgenda = ({ agendaItems }: { agendaItems?: string[] }) => {
  if (!agendaItems || agendaItems.length === 0) return null;
  return (
    <div className="agenda">
      <h2>Agenda</h2>
      <ul>
        {agendaItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

const EventTags = ({ tagList }: { tagList?: string[] }) => {
  if (!tagList || tagList.length === 0) return null;
  return (
    <div className="flex flex-row gap-1.5 flex-wrap">
      {tagList.map((tag) => (
        <div key={tag} className="pill">
          {tag}
        </div>
      ))}
    </div>
  );
};

interface EventData extends EventAttrs {
  _id: string;
}

async function EventContent({ slug }: { slug: string }) {
  "use cache";
  if (typeof window === "undefined") cacheLife("hours"); // server-side cache

  let event: EventData | undefined;

  // Try fetching from relative API route on server
  try {
    const res = await fetch(`/api/events/${slug}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      event = data.event;
    } else if (res.status === 404) {
      return notFound();
    }
  } catch (err) {
    // ignore, fallback to constants
  }

  // Fallback to constants if no API data
  if (!event) {
    const fallback = events.find((e) => e.slug === slug);
    if (!fallback) return notFound();

    event = {
      _id: slug, // generate dummy ID
      description: "",
      overview: fallback.title,
      mode: "Online",
      agenda: [],
      audience: "Everyone",
      organizer: "Organizer Info",
      tags: [],
      venue: "TBD", // <-- add this
      ...fallback,
    } as EventData;
  }

  const bookings = 10;
  const similarEvent: EventAttrs[] = await getSimilarEventsBySlug(slug);

  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p>{event.title}</p>
      </div>

      <div className="details">
        <div className="content">
          {event.image && (
            <Image src={event.image} alt="image banner" width={800} height={800} className="banner" />
          )}

          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{event.overview}</p>
          </section>

          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            {event.date && <EventDetailedItem icon="/icons/calendar.svg" alt="date" label={event.date} />}
            {event.time && <EventDetailedItem icon="/icons/clock.svg" alt="clock" label={event.time} />}
            {event.location && <EventDetailedItem icon="/icons/pin.svg" alt="pin" label={event.location} />}
            {event.mode && <EventDetailedItem icon="/icons/mode.svg" alt="mode" label={event.mode} />}
            {event.audience && <EventDetailedItem icon="/icons/audience.svg" alt="audience" label={event.audience} />}
          </section>

          <EventAgenda agendaItems={event.agenda} />

          <section className="flex-col-gap-2">
            <h2>About The Organizer</h2>
            <p>{event.organizer}</p>
          </section>

          <EventTags tagList={event.tags} />
        </div>

        <aside className="booking">
          <div className="signup-card">
            <h2>Register for the Event</h2>
            {bookings > 0 ? (
              <p className="text-sm">join {bookings} who already joined</p>
            ) : (
              <p className="text-sm">Be the first to join</p>
            )}

            <BookEvent eventId={event._id} slug={slug} />
          </div>
        </aside>
      </div>

      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events You May Like</h2>
        <div className="events">
          {similarEvent.length > 0 &&
            similarEvent.map((Sevent: EventAttrs, index) => (
              <EventCard key={Sevent.slug || `event-${index}`} {...Sevent} slug={Sevent.slug || ""} />
            ))}
        </div>
      </div>
    </section>
  );
}

const EventDetailedPage = async ({ params }: { params: { slug: string } }) => {
  return (
    <Suspense fallback={<div>Loading event...</div>}>
      <EventContent slug={params.slug} />
    </Suspense>
  );
};

export default EventDetailedPage;
