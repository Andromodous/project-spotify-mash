import { authOption } from 'a/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth/next'
import React from 'react'

export async function ListTopSongs() {
    const session = await getServerSession(authOption);
    const results: any | null = null

    try {
        console.log(`Bearer ${session?.accessToken}`);
        const favourite_artists: Response = await fetch(`https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=5`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${session?.accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(favourite_artists);
        if (!favourite_artists.ok) {
            throw new Error('Network response was not ok');
        }
        const results = await favourite_artists.json();
    }
    catch (error) {
        return (
            <>
                <h2>error</h2>
            </>
        )
    }

    return (
        <div>
            {/* <pre>{JSON.stringify(session)}</pre> */}
            <p>{JSON.stringify(results)}</p>
        </div>
    )
}
