import { Navigate } from "react-router";
import { authClient } from "../../../lib/auth-client"

export function AuthGuard({ children }: {
    children: React.ReactNode
}) {
    const { data: session, isPending, error } = authClient.useSession();

    if (isPending) {
        return <h1>Verifying...</h1>
    }

    if (error) {
        return <div>Could not validate session</div>
    }

    if (!session?.user) {
        return <Navigate  to={"/sign-in"} replace />
    }

    return <>{children}</>
}