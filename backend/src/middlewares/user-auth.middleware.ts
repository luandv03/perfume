import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { ConfigService } from "../configs/configService.config";

const configService = new ConfigService();

export const userAuthMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const access_token_user: string = req.cookies.access_token_user;

    if (!access_token_user) {
        return res
            .status(403)
            .json({ status: 403, message: "Not access token" });
    }

    try {
        const decoded = jwt.verify(
            access_token_user,
            configService.getSecretKeyAccessToken()
        );

        if (decoded) {
            res.locals.data = decoded;
        }

        return next();
    } catch (err) {
        return res.status(401).send({
            statusCode: 401,
            message: "Invalid Token",
            err,
        });
    }
};
