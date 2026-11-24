export const querykey = {
    auth: {
        all: ["auth"] as const,
        signin: () => [...querykey.auth.all, "signin"] as const,
        signup: () => [...querykey.auth.all, "signup"] as const,
        googleSignin: () => [...querykey.auth.all, "google-signin"] as const,
        signout: () => [...querykey.auth.all, "signout"] as const,
        singout: () => querykey.auth.signout(),
    },
    packs: {
        all: ["packs"] as const,
        list: () => [...querykey.packs.all, "list"] as const,
    },
    attempts: {
        all: ["attempts"] as const,
        mine: () => [...querykey.attempts.all, "mine"] as const,
        detail: (id: string) => [...querykey.attempts.all, id] as const,
    },
    leaderboard: {
        all: ["leaderboard"] as const,
        pack: (slug: string) => [...querykey.leaderboard.all, slug] as const,
    },
}