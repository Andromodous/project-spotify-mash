import React from 'react'
import { updateEmail } from './emailAction'


export default async function Unsubscribe({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    //Use server actions for mutations only. For fetching from a client component, just make a request to a route handler
    const email = searchParams['userId']
    const preference = searchParams['action'] 
    if (typeof email === 'string' && typeof preference === 'string' && (preference === 'TRUE' || preference === 'FALSE')) {
        await updateEmail(email, preference)
    }

    return (
        <section className='min-h-screen gap-'>
            <div className='text-center'>
                Your email preferences have been updated.
            </div>
        </section>
    )
}
