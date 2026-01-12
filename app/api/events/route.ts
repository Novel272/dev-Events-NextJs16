// Import MongoDB connection utility
import connectToDatabase from "@/lib/mongodb";
// Import Next.js request/response types
import { NextRequest, NextResponse } from "next/server";
// Import Event database model
import Event from "@/database/event.model";
// Import Cloudinary for image upload
import {v2 as cloudinary} from "cloudinary";

// Define POST handler for event creation
export async function POST(req: NextRequest){
    // Start try block to handle errors
    try{
        // Connect to MongoDB database
        await connectToDatabase();//from lib/mongodb.ts
        // Parse incoming request as form data (includes files)
        const FormData = await req.formData();//parse multipart/form-data
        // Declare event object to hold form data
        let event;//type so we can assign in as object.fromEntries

        // Try to convert form data entries to object
        try{
            // Convert FormData entries to plain JavaScript object
            event=Object.fromEntries(FormData.entries());//using entries to convert form data to object
        // Catch form data parsing errors
        }  catch(e){
            // Return 400 error if form data is invalid
            return NextResponse.json({ message: "Invalid form data"}, { status: 400 } );// Bad Request
        }
        // Extract image file from form data
        const file=FormData.get("image")as File;//get image file from form data
        // Check if image file exists
        if(!file){
            // Return 400 error if image is missing
            return NextResponse.json({ message: "Image file is required"}, { status: 400 } );// Bad Request
        }

        // Convert image file to binary buffer format
        const arrayBuffer=await file.arrayBuffer();
        // Convert ArrayBuffer to Node.js Buffer
        const buffer=Buffer.from(arrayBuffer)

        // Upload image to Cloudinary and get URL
        const uploadResult=await new Promise((resolve,reject)=>{
            // Create upload stream with image resource type and folder
            cloudinary.uploader.upload_stream({resource_type:"image",folder:"DevEvent"},(error,result)=>{
                // Reject promise if upload fails
                if(error) reject(error);
                // Resolve promise with upload result
                resolve(result); 
            }).end(buffer);
        })

        // Extract secure URL from upload result and assign to event
        event.image=(uploadResult as {secure_url:string}).secure_url;

        // Save event to database with all form fields and image URL
        const createdEvent= await Event.create(event);//From database/event.model.ts

        // Return 201 with success message and created event data
        return NextResponse.json({ message:"Event created successfully", event: createdEvent},{ status:201});

    // Catch any errors during processing
    }catch(e){
        // Log error to console for debugging
        console.error("Error handling event POST request:");
        // Return 500 error with error message details
        return NextResponse.json({ message: "Failed to process event",error:e instanceof Error ? e.message:"unknown"}, { status: 500 } );// Database connection or other error
    }
}

export async function GET(){
    try{
        await connectToDatabase();
        const events=await Event.find().sort({createdAt:-1});//latest first
        return NextResponse.json({message:"event Fetched successfully ",events},{status:200});


    }catch(e){
        return NextResponse.json({message:"Failed to Fetch events",error:e},{status:500});
    }
}