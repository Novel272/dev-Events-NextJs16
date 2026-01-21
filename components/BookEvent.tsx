"use client"
import React, { useState } from 'react'
import { createBooking } from '@/lib/actions/booking.action';
import posthog from 'posthog-js';

const BookEvent = ({eventId,slug}:{eventId:string,slug:string}) => {
    const [email,setEmail]=useState('');
    const [submitted,setSubmitted]=useState(false);


    const handleSubmit= async(e:React.FormEvent)=>{
        e.preventDefault();
        const{success}=await createBooking({eventId,slug,email});
        if(success){
            setSubmitted(true);
            posthog.capture('event_booked',{eventId,slug,email
            });
        }else{
            console.log("Booking submission failed");
            posthog.capture('booking_submission_failed', { eventId, slug, email });
        }
    
    }
  return (
    <div id='book-event'>
        {submitted?(
            <p className='text-sm'>Thank you for booking this event from our website</p>):(
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                            placeholder='Email Address' />
                    </div>
                    <button type="submit" className="button-submit">Submit</button>
                </form>
            )}
      
    </div>
  )
}

export default BookEvent
