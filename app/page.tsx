import EventCard from "@/components/EventCard"
import ExploreBtn from "@/components/ExploreBtn"
import { EventAttrs } from "@/database";

// Get the base URL from environment variables
const baseUrl = process.env.Next_PUBLIC_BASE_URL;


const Page = async () => {

  const response=await fetch(`${baseUrl}/api/events`);
  const {events}=await response.json();

  return (
    <section>
      <h1 className="text-center">The Hub For Every <br/> Event You Can't Miss</h1>
      <p className="text-center mt-5">Hackathons , Meetups, And Conference, All In One Place</p>
      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>

        <ul className="events">
          {events&&events.length>0&&events.map((event:EventAttrs)=>(
            <li key={event.slug}>
              <EventCard {...event}/>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Page
