import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { ConfigService } from "../configs/configService.config";

const configService = new ConfigService();

export const userAuthMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let access_token_user: string = req.headers["authorization"] as string;

    if (access_token_user?.startsWith("Bearer ")) {
        access_token_user = access_token_user.slice(
            7,
            access_token_user.length
        );
    }

    if (!access_token_user) {
        return res
            .status(401)
            .json({ statusCode: 401, message: "Not access token" });
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
