import NextAuth, { NextAuthOptions, TokenSet } from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"

export const authOption: NextAuthOptions = {
    session: {
        strategy: 'jwt',
        maxAge: 60 * 60 * 24 * 7 //session no longer valid after a week
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        SpotifyProvider({
            authorization: 'https://accounts.spotify.com/authorize?scope=user-read-email,playlist-read-private,user-top-read',
            clientId: process.env.SPOTIFY_CLIENT_ID as string,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string
        })
    ],
    callbacks: {
        //Requests to /api/auth/signin, /api/auth/session and calls to
        //getSession(), getServerSession(), useSession() will invoke this function,
        //but only if you are using a JWT session.
        async jwt({ token, account }) {
            if (account) { //when callback is invoked the first time. e.g. user being signed in
                token.accessToken = account.access_token
                token.expires_at = account.expires_at
                token.refresh_token = account.refresh_token
                return token
            }
            //case where token has not expired and subsequent invocations
            else if (typeof token.expires_at === 'number' && (Date.now() / 1000) < token.expires_at) {
                console.log(token) // ✅✅
                return token
            }
            else {
                try { //case where access token expired, we must fetch for new access token
                    const basicAuth = btoa(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`);
                    const response = await fetch("https://accounts.spotify.com/api/token", {
                        method: 'POST',
                        headers: {
                            'Authorization': `Basic ${basicAuth}`,
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: new URLSearchParams({
                            grant_type: 'refresh_token',
                            refresh_token: token.refresh_token as string

                        })
                    });
                    const tokens: TokenSet = await response.json();
                    if (!response.ok) throw tokens;
                    token.accessToken = tokens.access_token //refreshes and replaces outdated access token
                    token.expires_at = tokens.expires_at
                    token.refresh_token = tokens.refresh_token
                }
                catch (e) {
                    console.log(`could not refresh access token for ${token.email}`)
                }
                finally {
                    return token
                }
            }
        },
        async session({ token, session }) {
            session.accessToken = token.accessToken
            console.log(session)
            return session
        }
    }
}

const handler = NextAuth(authOption)

export { handler as GET, handler as POST }