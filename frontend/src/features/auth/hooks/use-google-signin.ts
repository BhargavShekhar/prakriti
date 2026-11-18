import { useMutation } from "@tanstack/react-query";
import { querykey } from "../../../lib/query-key";
import { authService } from "../services/auth.services";

export function useGoogleSignin() {
    return useMutation({
        mutationKey: querykey.auth.googleSignin(),
        mutationFn: authService.signInWithGoogle
    })
}
