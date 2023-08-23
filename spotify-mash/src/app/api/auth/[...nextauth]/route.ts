import NextAuth, { NextAuthOptions } from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"

export const authOption: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        SpotifyProvider({
            authorization: 'https://accounts.spotify.com/authorize?scope=user-read-email,playlist-read-private',
            clientId: process.env.SPOTIFY_CLIENT_ID as string,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string
        })
    ],
    // https://accounts.spotify.com/authorize?client_id=0c4be8bf30024d59bf0794481a8011d5&scope=user-read-email%2Cplaylist-read-private&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fspotify&state=acl8RR3Bg2_adQPiiRlzlOK2IarsY1OrWY3wBkHcVb8
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        async jwt({ token, account }) {
            if (token && token.accessToken !== 'undefined') {
                token.accessToken = account?.access_token
            }
            console.log('hi', account)
            // console.log(`token is ${JSON.stringify(token)} account is ${account}`)
            return token
        },
        async session({ session, token }) {
            if (session) {
                // session.user.accessToken = user.accessToken //involved module augmentation
                console.log(token)
                session.accessToken = token.accessToken
                console.log(session?.accessToken)
            }

            return session
        },
    }
}
const handler = NextAuth(authOption)

export { handler as GET, handler as POST }
