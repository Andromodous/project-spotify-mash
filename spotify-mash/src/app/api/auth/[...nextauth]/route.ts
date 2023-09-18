import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "../../../lib/prisma"
import NextAuth, { NextAuthOptions } from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import { Adapter } from "next-auth/adapters"

export const authOption: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as Adapter,
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        SpotifyProvider({
            authorization: 'https://accounts.spotify.com/authorize?scope=user-read-email,playlist-read-private,user-top-read',
            clientId: process.env.SPOTIFY_CLIENT_ID as string,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string
        })
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token
            }
            return token
        },

        async session({ session, user }) {
            const account = await prisma.account.findFirst({
                where: {
                    userId: user.id, provider: 'spotify'
                }
            });
            if (account != null && account.expires_at as number * 1000 < Date.now()) {
                try {
                    const basicAuth = btoa(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`);
                    const response = await fetch("https://accounts.spotify.com/api/token", {
                        method: 'POST',
                        headers: {
                            'Authorization': `Basic ${basicAuth}`,
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: new URLSearchParams({
                            grant_type: 'refresh_token',
                            refresh_token: account?.refresh_token as string

                        })
                    });
                    const tokens = await response.json()
                    if (!response.ok) throw tokens;

                    const { access_token } = await prisma.account.update({
                        data: {
                            access_token: tokens.access_token,
                            expires_at: Math.floor(Date.now() / 1000 + tokens.expires_in),
                            refresh_token: tokens.refresh_token ?? account.refresh_token,
                            scope: tokens.scope

                        },
                        where: {
                            provider_providerAccountId: {
                                provider: 'spotify',
                                providerAccountId: account.providerAccountId
                            }
                        }
                    });
                    session.accessToken = access_token as string

                }
                catch (e) {
                    console.log(`cannot refresh access token: ${e}`)
                }
            }
            session.accessToken = account?.access_token as string
            // Using a JWT to store the refresh_token is less secure than saving it in a database,
            //  and you need to evaluate based on your requirements which strategy you choose.
            return session;
        }
    }
}

const handler = NextAuth(authOption)

export { handler as GET, handler as POST }
