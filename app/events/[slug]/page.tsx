import { notFound } from "next/navigation";
import Image from "next/image";

const BASE_URL=process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailedItem=({icon,alt,label}:{icon:string;alt:string,label:string})=>{
  return(
    <div className="flex-row-gap-2 items-center">
      <Image src={icon} alt={alt} width={17} height={17}/>
      <p>{label}</p>
    </div>
  )
}

const EventAgenda=({agendaItems}:{agendaItems:string[]})=>{
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

const EventTags=({tagList}:{tagList:string[]})=>{
  return(
    <div className="flex flex-row gap-1.5  flex-warp">
      {tagList.map((tag)=>(
        <div  key={tag} className="pill">{tag}</div>
      ))}
    </div>
  )
}


const EventDetailedPage = async ({params}:{ params:Promise<{slug:string}>}) => {

  const {slug}=await params; 
  const request=await fetch(`${BASE_URL}/api/events/${slug}`);
  const {event:description,image,overview,date,time,location,mode,agenda,audience,tags,organizer}=await request.json();

  if(!description) return notFound();

  return (
    <section id="events">
      <div className="header"> 
        <h1>Event Description</h1>
        <p>{description}</p>
      </div>
      <div className="details">
        {/*left side of the page for detail side */}
        <div className="content">
          <Image src={image} alt="image banner" width={800} height={800} className="banner"/>

          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>
          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            <EventDetailedItem icon="/icons/calendar.svg" alt="date" label={date}/>
            <EventDetailedItem icon="/icons/clock.svg" alt="clock" label={time}/>
            <EventDetailedItem icon="/icons/pin.svg" alt="pin" label={location}/>
            <EventDetailedItem icon="/icons/mode.svg" alt="mode" label={mode}/>
            <EventDetailedItem icon="/icons/audience.svg" alt="audience" label={audience}/>
          </section>
          
          <EventAgenda agendaItems={JSON.parse(agenda[0])}/>

          <section className="flex-col-gap-2">
            <h2>About The Organizer</h2>
            <p>{organizer}</p>
          </section>
          <EventTags tagList={JSON.parse(tags[0])}/>

        </div>

        {/*right side of the page for booking side */}
        <aside className="booking">
          <p className="text-lg font-semibold">book here</p>
        </aside>
      </div>
    </section>
  )
};

export default EventDetailedPage;
