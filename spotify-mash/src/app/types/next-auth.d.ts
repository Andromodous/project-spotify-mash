import { JWT } from "next-auth/jwt"
import { Auth } from "@auth/core"



declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     * This is used for module augmentation 
     */
    interface Session {
        accessToken?: string
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        accessToken: string | undefined
        expires_at: number | undefined
        refresh_token: string | undefined
    }
}
