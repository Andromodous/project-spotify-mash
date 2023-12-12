import { authOption } from 'a/app/api/auth/[...nextauth]/route'
import { Track } from 'a/app/lib/interface.track'
import { TrackDisplay } from 'a/components/TrackDisplay'
import { GenreInsights } from 'a/components/GenreInsights'
import { getServerSession } from 'next-auth'
import React, { Suspense } from 'react'

export default async function About() {
  const session = await getServerSession(authOption);
  let res: Track[] = [];
  let artists = new Map<string, string>()
  try {
    const favourite_artists: Response = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=20`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session?.accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    if (!favourite_artists.ok) {
      throw new Error(favourite_artists.status + ' Network response was not ok');
    }
    const { items } = await favourite_artists.json() as { items: Track[] };
    res = items;
    items.map((track) => {
      for (const artist of track.artists) {
        const { name, id } = artist
        artists.set(name, id)
      }
    });
  }
  catch (error: any) {
    return (
      <>
        <h2>error</h2>
        <span>{error}</span>
      </>
    )
  }
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 min-h-screen gap-'>
      <div className='flex flex-col gap-1 py-2'>
        <h2 className='font-bold text-xl text-center underline decoration-sky-500/30'>
          Your Favourite Songs
        </h2>
        <Suspense fallback={<h1>Your tracks are loading</h1>}>
          <TrackDisplay tracks={res} />
        </Suspense>
      </div>
      <div className='flex flex-col gap-1 py-2'>
        <h2 className='font-bold text-xl text-center underline decoration-sky-500/30'>
          Your Genre Insights
        </h2>
        <Suspense fallback={<h1>Your tracks are loading</h1>}>
          <GenreInsights favArtists={artists} />
        </Suspense>
      </div>
    </div>
  )
}