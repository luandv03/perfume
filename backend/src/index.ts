import express, { Application } from "express";
import { Request, Response } from "express";
import { QueryResult } from "pg";
import cookieParser from "cookie-parser";
import session from "express-session";
import cors from "cors";
import path from "path";

import { query } from "./db/index.db";

import router from "./routes/index.routes";
import paymentRoutes from "./routes/v1/payments/payment.routes";

const app: Application = express();
const PORT: number = 8888;

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(
    cors({
        credentials: true,
        origin: [
            "http://localhost:5173",
            "http://localhost:3000",
            "http://192.168.0.101:5173",
        ],
    })
);

// xử lý dữ liệu gửi lên từ Client
app.use(express.json()); // xử lý dữ liệu gửi từ frontend -> backend dưới định dạng json:
//chuyển đổi sang Javascript giúp ta có thể lấy được trong req.body

// xử lý dữ liệu được gửi lên dưới dạng form HTML (application/x-www-form-url)
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
    session({
        secret: "I_LOVE_TTMH", // Chuỗi bí mật để mã hóa cookie
        resave: false,
        saveUninitialized: true,
    })
);

app.get("/payments/momo", (req, res) => {
    query(`SELECT * FROM momo_wallet`).then((resulst) => {
        res.json(resulst.rows);
    });
});

app.get("/payments/vnpay", (req, res) => {
    query(`SELECT * FROM vnpay_wallet`).then((resulst) => {
        res.json(resulst.rows);
    });
});

app.get("/token", (req, res) => {
    res.render("reset_password", {
        data: {
            newPassword: 123456,
        },
    });
});

app.get("/photo", (req, res) => {
    query(
        `SELECT product_id FROM product_photos GROUP BY product_id HAVING count(*) > 1`
    ).then((resulst) => {
        res.json(resulst.rows);
    });
});

app.use("/", router);

app.listen(PORT, () => {
    console.log("server is listening on port " + PORT);
});
