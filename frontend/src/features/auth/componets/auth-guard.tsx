import { Navigate } from "react-router";
import { authClient } from "../../../lib/auth-client"
import { DashboardLoader } from "../../dashboard/components/dashboar-loader";

export function AuthGuard({ children }: {
    children: React.ReactNode
}) {
    const { data: session, isPending, error } = authClient.useSession();

    if (isPending) {
        return <DashboardLoader />
    }

    if (error) {
        return <div>Could not validate session</div>
    }

    if (!session?.user) {
        return <Navigate  to={"/sign-in"} replace />
    }

    return <>{children}</>
}