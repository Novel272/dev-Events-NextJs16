'use client'
import React, { useState } from 'react'

const BookEvent = () => {
    const [email,setEmail]=useState('');
    const [submitted,setSubmitted]=useState(false);
    const handleSubmit=(e:React.FormEvent)=>{
        e.preventDefault();
        setTimeout(()=>{
            setSubmitted(true);
        },10000);
    
    }
  return (
    <div className='book-event'>
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
                    <button type='submit' className='button-submit'>Submit</button>
                </form>
            )}
      
    </div>
  )
}

export default BookEvent
