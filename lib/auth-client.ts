import { adminClient, magicLinkClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const { signIn, signOut, useSession, admin } = createAuthClient({
  plugins: [adminClient(), magicLinkClient()],
})
