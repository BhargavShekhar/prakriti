import { useEffect } from "react";
import { useNavigate } from "react-router";
import { authClient } from "../../../lib/auth-client";
import { useSignout } from "../../auth/hooks/use-signout";
import { Button } from "../../../components/ui/button";
import { useDashboard } from "../hooks/use-dashbord";

export function Dashboard() {
    const navigate = useNavigate();
    const { data: session } = authClient.useSession();
    const { data, isPending, error } = useDashboard();
    const signoutMutation = useSignout();

    useEffect(() => {
        console.log(session?.user);
    }, [session])

    if (isPending) return <p>Loading...</p>;
    if (error) return <p>Error loading dashboard</p>;

    function handleSignout() {
        signoutMutation.mutate(undefined, {
            onSuccess: () => navigate("/sign-in", { replace: true }),
        });
    }

    return <div className="p-4">
        <div className="mb-4 flex justify-end">
            <Button variant="outline" disabled={signoutMutation.isPending} onClick={handleSignout}>
                {signoutMutation.isPending ? "Signing out..." : "Sign out"}
            </Button>
        </div>
        {signoutMutation.error && (
            <p className="mb-4 text-sm text-destructive">{signoutMutation.error.message}</p>
        )}
        {JSON.stringify(data)}
    </div>;
}