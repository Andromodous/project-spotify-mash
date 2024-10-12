export function parsePayload(payload: any) {
    const artists = [], artistscores = []
    for (var i = 0; i < payload.length - 2; i++) {
        if (i % 2 == 0) {
            artists.push(payload[i] as string);
        }
        else {
            artistscores.push(parseInt(payload[i]));
        }
    }
    return { artists, artistscores }
}