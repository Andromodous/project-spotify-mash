
export async function processArtist(userId: string, artist: string) {
    const res = await fetch('/api/leaderboard/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, artist })
    })
    const data = await res.json();
    console.log(data)
    if (!res.ok) {
        const { error } = data;
        console.log(`error received: ${error}`)
        throw new Error(error)
    }
}