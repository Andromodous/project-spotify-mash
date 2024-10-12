import { Track } from 'a/app/lib/interface.track'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import spotifyLogo from '../../public/spotify-logo-white.png'

export const Song = ({ Track, rank }: { Track: Track, rank: number }) => {
    const { name, popularity, external_urls: { spotify }, album: { images }, artists } = Track
    return (
        <div className='flex items-start justify-between items-center p-4 rounded-xl text-grey-700 drop-shadow-lg'>
            <div className='flex px-2 flex-col gap-1 w-full'>
                <h3 className='underline decoration-indigo-500 sm:text-xl font-bold tracking-tighter'>
                    #{rank} - {name}
                </h3>
                <h3 className='font-bold'>
                    {artists.map((artist, index) => ( //forgot to add key here
                        <p key={artist.id}> 
                            {artist.name + ((artists.length - 1) != index ? ', ' : " ")}
                        </p>
                    ))}
                    |
                    <span className='text-red-800 font-bold'> {popularity}</span>
                </h3>

                <Link className='flex justifty-between items-center items-start rounded-full bg-[#1DB954] px-3 py-2 w-fit'
                    href={spotify}
                    about='OPEN SPOTIFY'
                    target='_blank'>
                    <div className='flex items-center justify-between gap-3'>
                        <Image src={spotifyLogo} alt='OPEN SPOTIFY' width={25} />
                        <p>LISTEN ON SPOTIFY</p>
                    </div>
                </Link>
            </div>
            {/* <p>{images[1].url}</p> */}
            <Image
                className='hidden h-auto max-w-md shadow-lg dark:shadow-black/30 sm:inline'
                src={images[1].url}
                width={100}
                height={100}
                alt={`PLAY ON SPOTIFY`}
            />
        </div>
    )
}
