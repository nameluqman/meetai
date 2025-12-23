import { polarClient } from "@polar-sh/better-auth";
import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
    plugins : [polarClient()]
});
// we are on the same domain, so no need to specify apiUrl