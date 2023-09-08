interface Album {
    album_type: string,
    images: {
        url: string,
        height: number | null,
        width: number | null
    }[]
    name: string,
    release_date: string,
}


export interface Track {
    rank: number,
    album: Album,
    artists: {
        name: string,
    }[],
    external_urls: {
        spotify: string
    },
    name: string,
    id: string,
    popularity: number
}