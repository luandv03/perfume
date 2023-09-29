import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { ConfigService } from "../configs/configService.config";

const configService = new ConfigService();

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let access_token: string = req.headers["authorization"] as string;

    if (access_token?.startsWith("Bearer ")) {
        access_token = access_token.slice(7, access_token.length);
    }

    if (!access_token) {
        return res
            .status(401)
            .json({ statusCode: 401, message: "Not access token" });
    }

    try {
        const decoded = jwt.verify(
            access_token,
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
