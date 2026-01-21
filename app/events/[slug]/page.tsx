import {Suspense} from "react";
import EventDetails from "@/components/EventDetails";


const EventDetailedPage = async ({ params }: { params: Promise < { slug: string }> }) => {
     const slug = params.then((p) => p.slug);
  return (
    <Suspense fallback={<div>Loading event...</div>}>
      <EventDetails params={slug} />
    </Suspense>
  );
};

export default EventDetailedPage;
