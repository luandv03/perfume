"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeMiddleware = void 0;
var authorizeMiddleware = function (req, res, next) {
    if (res.locals.data && res.locals.data.role === "root_admin") {
        next();
    }
    else {
        res.status(401).json({
            status: 401,
            message: "Unauthorization!",
        });
    }
};
exports.authorizeMiddleware = authorizeMiddleware;
