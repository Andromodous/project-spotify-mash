import { Winner } from 'a/app/lib/interface.winner'
import React from 'react'

export const WinnersBanner = ({ data }: { data: Winner[] }) => {


    return (
        <aside className='flex flex-col gap-2 sm:w-2/6 w-full text-center'>
            {data.length == 0 ? <h3>this will be the first poll</h3> : <h3>✌️ What the past polls look like ✌️</h3>}
            {data.length > 0 &&
                <>

                    
                    <div className='flex justify-around'>
                        <p className='font-extrabold'>artist</p>
                        <p className='font-extrabold'>vote count</p>
                        <p className='font-extrabold'>poll closed</p>
                    </div>
                    {data.map(poll => (
                        <div className='flex justify-around'>
                            <p>{poll.artist}</p>
                            <p>{poll.votes}</p>
                            <p>{poll.poll_date}</p>
                        </div>
                    ))}
                </>
            }
        </aside >
    )
}