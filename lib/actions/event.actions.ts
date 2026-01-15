"use server"
import { connectToDatabase } from "@/lib/mongodb";
import Event from "@/database/event.model";

// Function to get similar events by slug
export const getSimilarEventsBySlug=async(slug:string)=>{
    try{
        await connectToDatabase();//from lib/mongodb.ts

        const event = await Event.findOne({ slug });
        const SimilarEvents = await Event.find(
            { _id: { $ne: event?._id} ,tags: {$in: event?.tags} }).lean();

        return SimilarEvents;
    }catch{
        return [];
    }
}
