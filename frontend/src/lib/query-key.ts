export const querykey = {
    auth: {
        all: ["auth"] as const,

        signin: () => [...querykey.auth.all, "signin"] as const,

        signup: () => [...querykey.auth.all, "signup"] as const,

        googleSignin:  () => [...querykey.auth.all, "google-signin"] as const,

        signout: () => [...querykey.auth.all, "signout"] as const,

        singout: () => querykey.auth.signout(),
    }
}