import { fromNodeHeaders } from "better-auth/node";

import { auth } from "../db/auth.js";
import ApiError from "../utils/api-error.js";

import type { Request, Response, NextFunction } from "express";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers)
    });

    if (!session) {
        return next(ApiError.unauthorized("Session is invalid, please login again"));
    }

    res.locals.user = session.user;
    res.locals.session = session.session;

    return next();
}