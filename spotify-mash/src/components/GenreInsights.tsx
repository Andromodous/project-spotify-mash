import { authOption } from 'a/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { processGenre } from 'a/app/functions/processgenre'
import { GenreChart } from 'a/components/GenreChart'
import React from 'react'
import { Artist } from 'a/app/lib/interface.artist'

export const GenreInsights = async ({ favArtists }: { favArtists: Map<string, string> }) => {
    const session = await getServerSession(authOption);
    let ids: string[] = []
    let genres = new Map<string, number>()
    try {
        favArtists.forEach((value) => {
            ids.push(value)
        })
        const genre_insights: Response = await fetch(`https://api.spotify.com/v1/artists?ids=${ids.join(',')}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${session?.accessToken}`,
                'Content-Type': 'application/json'
            }
        })
        if (!genre_insights.ok) {
            throw new Error(genre_insights.status + ' Network response was not ok');
        }
        const { artists } = await genre_insights.json() as { artists: Artist[] };
        genres = processGenre(artists)
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
            <GenreChart genrestats={genres} />
        </>
    )
}
