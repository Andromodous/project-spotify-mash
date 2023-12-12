'use client'

import React, { useEffect, useState } from 'react'
import { Song } from 'a/components/Song'
import { Track } from 'a/app/lib/interface.track'

export const TrackDisplay = ({ tracks }: { tracks: Track[] }) => {
    const [order, setOrder] = useState<string>('sort');
    const [topTracks, setTopTracks] = useState<Track[]>(tracks)
    const [popularityAverage, setPopularityAverage] = useState<number>(0);

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
    
    useEffect(() => {
        let popularity = 0
        for (const track of tracks) {
            popularity += track.popularity
        }
        setPopularityAverage(popularity / tracks.length)
    }, [])

    return (
        <>
            <form id='track-order' className='flex p-2 justify-between items-center'>
                {
                    popularityAverage > 0 &&
                    <p>average | <span className='text-red-800 font-bold'>{popularityAverage}</span></p>
                }
                <select
                    className="rounded-md sm:w-full md:w-1/4 hover:cursor-pointer bg-inherit p-2 shadow-lg border border-stone-800 focus    :border-stone-800 font-sans"
                    title='track order'
                    value={order}
                    onChange={(e) => {
                        setOrder(e.target.value)
                    }}>
                    <option className='bg-stone-300 hover:bg-stone-100' value='sort'>sort</option>
                    <option className='bg-stone-300 hover:bg-stone-100' value='popularity'>popularity</option>
                    <option className='bg-stone-300 hover:bg-stone-100' value='alphabetical'>alphabetical</option>
                </select>
            </form>
            {topTracks.map((info, index) => {
                const props = {
                    Track: info,
                    rank: (index + 1)
                }
                return (
                    <Song key={info.id} {...props} />
                )
            })
            }
        </>
    )
}
