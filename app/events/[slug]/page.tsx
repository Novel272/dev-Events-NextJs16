export const dynamic = 'force-dynamic';

import { notFound } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";
import BookEvent from "@/components/BookEvent";
import { EventAttrs } from "@/database";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import EventCard from "@/components/EventCard";
import { cacheLife } from "next/cache";

const BASE_URL=process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailedItem=({icon,alt,label}:{icon:string;alt:string,label:string})=>{
  return(
    <div className="flex-row-gap-2 items-center">
      <Image src={icon} alt={alt} width={17} height={17}/>
      <p>{label}</p>
    </div>
  )
}

const EventAgenda=({agendaItems}:{agendaItems?:string[]})=>{
  // BUGFIX: Check if agendaItems exists and has items before mapping
  // Without this check, calling .map() on undefined will throw "Cannot read properties of undefined"
  if(!agendaItems || agendaItems.length === 0) return null;
  return(
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item)=>(
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
  )
}

const EventTags=({tagList}:{tagList?:string[]})=>{
  // BUGFIX: Check if tagList exists and has items before mapping
  // Without this check, calling .map() on undefined will throw "Cannot read properties of undefined"
  if(!tagList || tagList.length === 0) return null;
  return(
    <div className="flex flex-row gap-1.5  flex-wrap">
      {tagList.map((tag)=>(
        <div  key={tag} className="pill">{tag}</div>
      ))}
    </div>
  )
}

interface EventData {
  _id: string;
  title: string;
  description: string;
  image: string;
  overview: string;
  date: string;
  time: string;
  location: string;
  mode: string;
  agenda: string[];
  audience: string;
  tags: string[];
  organizer: string;
}

async function EventContent({ slug }: { slug: string }) {
  if (!BASE_URL) {
    throw new Error('BASE_URL is not defined');
  }
  
  const request = await fetch(`${BASE_URL}/api/events/${slug}`);
  
  if (request.status === 404) {
    return notFound();
  }
  
  if (!request.ok) {
    throw new Error(`Failed to fetch event: ${request.status} ${request.statusText}`);
  }
  
  const data = await request.json();
  const { _id, title, description, image, overview, date, time, location, mode, agenda, audience, tags, organizer } = data.event || {};

  if (!title) return notFound();

  const bookings = 10;
  const similarEvent: EventAttrs[] = await getSimilarEventsBySlug(slug);

  return (
    <section id="event">
      <div className="header"> 
        <h1>Event Description</h1>
        <p>{title}</p>
      </div>
      <div className="details">
        {/*left side of the page for detail side */}
        <div className="content">
          {image && <Image src={image} alt="image banner" width={800} height={800} className="banner"/>}

          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>
          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            {date && <EventDetailedItem icon="/icons/calendar.svg" alt="date" label={date}/>}
            {time && <EventDetailedItem icon="/icons/clock.svg" alt="clock" label={time}/>}
            {location && <EventDetailedItem icon="/icons/pin.svg" alt="pin" label={location}/>}
            {mode && <EventDetailedItem icon="/icons/mode.svg" alt="mode" label={mode}/>}
            {audience && <EventDetailedItem icon="/icons/audience.svg" alt="audience" label={audience}/>}
          </section>
          
          <EventAgenda agendaItems={agenda}/>

          <section className="flex-col-gap-2">
            <h2>About The Organizer</h2>
            <p>{organizer}</p>
          </section>
          <EventTags tagList={tags}/>

        </div>

        {/*right side of the page for booking side */}
        <aside className="booking">
          <div className="signup-card">
            <h2>Register for the Event</h2>
            {bookings>0?(
              <p className="text-sm">join {bookings} who already joined</p>
            ):(
              <p className="text-sm">Be the first to join</p>
            )}

            <BookEvent eventId={_id} slug={slug} />
          </div>
        </aside>
      </div>
      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events You May Like</h2>
        <div className="events">
          {similarEvent.length>0 && similarEvent.map((Sevent:EventAttrs, index)=>(
            <EventCard key={Sevent.slug || `event-${index}`} {...Sevent} slug={Sevent.slug || ''}/>
          ))}
        </div>
      </div>
    </section>
  );
}

const EventDetailedPage = async({ params }: { params: Promise<{ slug: string }> }) => {
  "use cache";
  cacheLife("hours");
  
  // Await params here, outside the Suspense boundary
  const { slug } = await params;

  return (
    <Suspense fallback={<div>Loading event...</div>}>
      <EventContent slug={slug} />
    </Suspense>
  );
};

export default EventDetailedPage;
