import { useMutation } from "@tanstack/react-query";
import { querykey } from "../../../lib/query-key";
import { authService } from "../services/auth.services";

export function useSignout() {
    return useMutation({
        mutationKey: querykey.auth.signout(),
        mutationFn: authService.signOut
    })
}
