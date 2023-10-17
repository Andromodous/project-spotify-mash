'use client'

import React, { useEffect, useState } from 'react'
import { Song } from 'a/components/Song'
import { Track } from 'a/app/lib/interface.track'

export const TrackDisplay = ({ tracks }: { tracks: Track[] }) => {
    const [order, setOrder] = useState<string>('');
    const [topTracks, setTopTracks] = useState<Track[]>(tracks)

    useEffect(() => {
        switch (order) {
            case 'popularity':
                setTopTracks([...topTracks].sort((a, b) => b.popularity - a.popularity))
                break
            case 'alphabetical':
                setTopTracks([...topTracks].sort((a, b) => a.name.localeCompare(b.name)))
                break
            default:
                setTopTracks(tracks)
        }
    }, [order])

    return (
        <div className='flex flex-col gap-1 py-2'>
            <h2 className='font-bold text-xl text-center underline decoration-sky-500/30'>
                Your Favourite Songs
            </h2>
            {/* <Image className='rounded-full mx-auto' src={session?.user?.image as string} alt='user profile'
                width={30}
                height={30} /> */}

            <form id='track-order' className='flex flex-row-reverse p-2'>
                <select
                    className="rounded-md sm:w-full md:w-1/4 hover:cursor-pointer bg-inherit p-2 shadow-lg border border-stone-800 focus    :border-stone-800 font-sans"
                    title='track order'
                    value={order}
                    onChange={(e) => {
                        setOrder(e.target.value)
                    }}>
                    <option className='bg-stone-300 hover:bg-stone-100' value=''>sort</option>
                    <option className='bg-stone-300 hover:bg-stone-100' value='popularity'>popularity</option>
                    <option className='bg-stone-300 hover:bg-stone-100' value='alphabetical'>alphabetical</option>
                </select>
            </form>
            {topTracks.map((info, index) => {
                const props = {
                    Track: info,
                    rank: (index + 1)
                }
                return <div key={info.id}>
                    <Song key={info.id} {...props} />
                </div>
            })
            }
        </div>
    )
}
