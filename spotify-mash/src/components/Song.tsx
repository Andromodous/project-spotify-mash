import { Track } from 'a/app/lib/interface.track'
import { Calendar } from 'a/components/calendar.svg'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export const Song = ({ Track, rank }: { Track: Track, rank: number }) => {
    const { name, popularity, external_urls: { spotify }, album: { album_type, images, release_date }, artists } = Track
    return (
        <div className='flex items-start justify-between items-center p-2 rounded-xl text-grey-700 drop-shadow-lg font-sans'>
            <div className='flex px-2 flex-col gap-1 max-w-lg'>
                <Link className='underline decoration-indigo-500 sm:text-xl font-bold tracking-tighter'
                    href={spotify}
                    about='go to song'
                    target='_blank'>
                    #{rank} - {name}
                </Link>
                <h3 className='font-bold'>
                    {artists.map((artist, index) => (
                        <>
                            {artist.name + ((artists.length - 1) != index ? ', ' : " ")}
                        </>
                    ))}
                    |
                    <span className='text-red-800 font-bold'> {popularity}</span>
                </h3>
                <div className='flex items-center gap-2 text-xs text-slate-500'>
                    <Calendar color='grey' /> {release_date}
                </div>
            </div>
            <Image
                className='hidden h-auto max-w-md shadow-lg dark:shadow-black/30 sm:inline'
                src={images[1].url}
                width={100}
                height={100}
                alt={`${album_type} cover of ${name}`}
                quality={75}
            />
        </div>
    )
}
