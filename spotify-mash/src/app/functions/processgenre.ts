export function processGenre(artists: Artist[]): Map<string, number> {
    let genres = new Map<string, number>()

    for (const artist of artists) {
        for (const genre of artist.genres) {
            if (genres.has(genre)) {
                genres.set(genre, genres.get(genre) as number + 1)
            }
            else {
                genres.set(genre, 1)
            }
        }
    }
    return genres
}