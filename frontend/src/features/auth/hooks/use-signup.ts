import { useMutation } from "@tanstack/react-query";
import { querykey } from "../../../lib/query-key";
import { authService } from "../services/auth.services";

export function useSignup() {
    return useMutation({
        mutationKey: querykey.auth.signup(),
        mutationFn: authService.singUp
    })
}