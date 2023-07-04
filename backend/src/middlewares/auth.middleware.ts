import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { ConfigService } from "../configs/configService.config";

const configService = new ConfigService();

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const access_token: string = req.cookies.access_token;

    if (!access_token) {
        return res
            .status(403)
            .json({ status: 403, message: "Not access token" });
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
