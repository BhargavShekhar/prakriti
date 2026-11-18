import { authClient } from "../../../lib/auth-client"

export const authService = {
    async signIn({ email, password }: {
        email: string,
        password: string
    }) {
        const { data, error } = await authClient.signIn.email({
            email,
            password
        });

        if (error) {
            throw new Error(error.message);
        }

        return data;
    },

    async singUp({ email, password, name }: {
        email: string,
        password: string,
        name: string
    }) {
        const { data, error } = await authClient.signUp.email({
            email,
            name,
            password,
        });

        if (error) {
            throw new Error(error.message);
        }

        return data;
    },

    async signInWithGoogle() {
        const { data, error } = await authClient.signIn.social({
            provider: "google",
            callbackURL: `${import.meta.env.VITE_FRONTEND_URL}/`
        });

        if (error) {
            throw new Error(error.message);
        }

        return data;
    },

    async signOut() {
        const { data, error } = await authClient.signOut();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }
}