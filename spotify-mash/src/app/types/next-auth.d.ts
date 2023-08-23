import { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"


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
        accessToken?: string
    }
}