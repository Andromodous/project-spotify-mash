'use client'

import React from "react"

export default function error() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <main className="flex min-h-screen flex-col items-center gap-4 py-4 px-2">
            <h2 className='font-bold text-2xl text-center underline decoration-sky-500/30'>
                There was an error ....
            </h2>
            <h4 className='font-bold text-md text-center underline decoration-sky-500/30'>
                Go back to home page
            </h4>
        </main>
    )
}