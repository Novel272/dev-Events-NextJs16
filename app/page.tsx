import EventCard from "@/components/EventCard"
import ExploreBtn from "@/components/ExploreBtn"
import { EventAttrs } from "@/database";
import { cacheLife } from "next/cache";


// Get the base URL from environment variables
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;


const Page = async () => {
  'use cache';
  cacheLife("hours");

  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_BASE_URL is not defined');
  }

  const response=await fetch(`${baseUrl}/api/events`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`);
  }
  
  const {events}=await response.json();

  return (
    <section>
      <h1 className="text-center">The Hub For Every <br/> Event You Can't Miss</h1>
      <p className="text-center mt-5">Hackathons , Meetups, And Conference, All In One Place</p>
      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        <ul className="events">
         {events &&
  events.length > 0 &&
  events
    .filter((event: EventAttrs) => event.slug)
    .map((event: EventAttrs, index: number) =>(
            <li key={event.slug || `event-${index}`} className="list-none">
              <EventCard {...event} slug={event.slug || ''}/>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Page
