import { authOption } from 'a/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth/next'
import React from 'react'

export async function ListTopSongs() {
    const session = await getServerSession(authOption)

    const favourite_artists: Response = await fetch(`https://api.spotify.com/v1/me/top/artists/tracks`, {
        method: 'GET',
        headers: {
            // 'Authorization': `Bearer ${session?.user?.accessToken}`
        }
    })
    return (
        <div>
            <pre>{JSON.stringify(session, null, 2)}</pre>
        </div>
    )
}
