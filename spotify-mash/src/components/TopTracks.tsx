import { authOption } from 'a/app/api/auth/[...nextauth]/route'
import { Track } from 'a/app/lib/interface.track'
import { getServerSession } from 'next-auth/next'
import { TrackDisplay } from 'a/components/TrackDisplay'

import React from 'react'

export async function ListTopSongs() {
    const session = await getServerSession(authOption);
    let res: Track[] = [];
    try {
        const favourite_artists: Response = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=20`, {
            // next: { revalidate: 3600 },
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
    }
    catch (error: any) {
        return (
            <>
                <h2>error</h2>
            </>
        )
    }
    return (
        <TrackDisplay tracks={res} />
    )
}
