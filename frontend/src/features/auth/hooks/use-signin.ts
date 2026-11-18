import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.services";
import { querykey } from "../../../lib/query-key";

export function useSignin() {
    return useMutation({
        mutationKey: querykey.auth.signin(),
        mutationFn: authService.signIn
    })
}