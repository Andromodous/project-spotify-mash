
export async function processArtist(artist: string) {
    const res = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: 'five nights', artist: artist })
    })
    const data = await res.json();
    if (!res.ok) {
        const { error } = data;
        throw new Error(error)
    }
    return data;
}