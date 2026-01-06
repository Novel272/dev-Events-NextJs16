export type Event = {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
};

export const events: Event[] = [
  {
    title: "React Conf 2026",
    image: "/images/event1.png",
    slug: "react-conf-2026",
    location: "Las Vegas, NV",
    date: "May 15, 2026",
    time: "9:00 AM"
  },
  {
    title: "JSConf EU 2026",
    image: "/images/event2.png",
    slug: "jsconf-eu-2026",
    location: "Berlin, Germany",
    date: "June 2, 2026",
    time: "10:00 AM"
  },
  {
    title: "Hack the North",
    image: "/images/event3.png",
    slug: "hack-the-north-2026",
    location: "Waterloo, Canada",
    date: "September 12, 2026",
    time: "8:00 AM"
  },
  {
    title: "TechCrunch Disrupt 2026",
    image: "/images/event4.png",
    slug: "techcrunch-disrupt-2026",
    location: "San Francisco, CA",
    date: "October 18, 2026",
    time: "11:00 AM"
  },
  {
    title: "PyCon US 2026",
    image: "/images/event5.png",
    slug: "pycon-us-2026",
    location: "Pittsburgh, PA",
    date: "May 22, 2026",
    time: "9:30 AM"
  },
  {
    title: "Google I/O 2026",
    image: "/images/event6.png",
    slug: "google-io-2026",
    location: "Mountain View, CA",
    date: "May 14, 2026",
    time: "10:00 AM"
  }
];