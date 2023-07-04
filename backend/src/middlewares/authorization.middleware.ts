import { Request, Response, NextFunction } from "express";

export const authorizeMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (res.locals.data && res.locals.data.role === "root_admin") {
        next();
    } else {
        res.status(401).json({
            status: 401,
            message: "Unauthorization!",
        });
    }
};
