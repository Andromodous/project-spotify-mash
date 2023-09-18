import { authOption } from 'a/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import React from 'react'

export const GenreInsights = async ({ favArtists }: { favArtists: Map<string, string> }) => {
    const session = await getServerSession(authOption);
    let ids: string[] = []
    try {
        favArtists.forEach((value) => {
            ids.push(value)
        })
        // const genre_insights: Response = await fetch(`https://api.spotify.com/v1/artists?ids=${ids.join(',')}`, {
        //     method: 'GET',
        //     headers: {
        //         'Authorization': `Bearer ${session?.accessToken}`,
        //         'Content-Type': 'application/json'
        //     }
        // })
        // if (!genre_insights.ok) {
        //     throw new Error(genre_insights.status + ' Network response was not ok');
        // }
        // const { artists } = await genre_insights.json() as { artists: Artist[] };
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
        <>
            <div>GenreInsights</div>
        </>
    )
}
