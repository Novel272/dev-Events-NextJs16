import Link from "next/link";
import Image from "next/image";

// Define the props interface with capitalized name following TypeScript conventions
interface Props {
    title: string;
    image: string;
    slug: string;
    location: string;
    date: string;
    time: string;
}

// Event card component that displays event information with a clickable link
const EventCard = ({ title, image, slug, location, date, time }: Props) => {
  return (
    // Use template literal (backticks) to properly interpolate the slug variable in the URL
    <Link href={`/events/${slug}`} id='event-card'>
      {/* Display the event poster image */}
      <Image src={image} alt={title} width={410} height={300} className="poster" />

      {/* Location section with pin icon */}
      <div className="flex flex-row gap-2">
        <Image src="/icons/pin.svg" alt="location" width={16} height={16} />
        <p>{location}</p>
      </div>

      {/* Event title */}
      <p className="title">{title}</p>

      {/* Date and time information section */}
      <div className="datetime">
        {/* Date with calendar icon */}
        <div>
          <Image src="/icons/calendar.svg" alt="date" width={16} height={16} />
          <p>{date}</p>
        </div>
        {/* Time with clock icon */}
        <div>
          <Image src="/icons/clock.svg" alt="time" width={16} height={16} />
          <p>{time}</p>
        </div>
      </div>
    </Link>
  );
};

// Export the component as default
export default EventCard;
