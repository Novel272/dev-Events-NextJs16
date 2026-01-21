"use server"
import { connectToDatabase } from "@/lib/mongodb";
import Event, { EventDocument } from "@/database/event.model";

// Function to get similar events by slug
export const getSimilarEventsBySlug = async (slug: string) => {
  try {
    await connectToDatabase(); //from lib/mongodb.ts

    const event = await Event.findOne({ slug });
    const SimilarEvents = await Event.find({
      _id: { $ne: event?._id },
      tags: { $in: event?.tags },
    }).lean();

    return SimilarEvents;
  } catch {
    return [];
  }
};

// Get all events sorted by latest
export const getAllEvents = async (): Promise<EventDocument[]> => {
  try {
    await connectToDatabase();
    const events = await Event.find().sort({ createdAt: -1 }).lean<EventDocument[]>();
    return events;
  } catch (e) {
    console.error("Failed to fetch events:", e);
    return [];
  }
};

// Get a single event by slug
export const getEventBySlug = async (slug: string): Promise<EventDocument | null> => {
  try {
    await connectToDatabase();
    const event = await Event.findOne({ slug }).lean<EventDocument | null>();
    return event;
  } catch (e) {
    console.error("Failed to fetch event by slug:", e);
    return null;
  }
};
