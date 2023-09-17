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
        origin: ["http://localhost:5173", "http://localhost:3000"],
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

app.get("/", (req: Request, res: Response) => {
    res.json({
        name: "Luan Dinh",
        age: 20,
        address: "Ha nam",
    });
});

app.get("/products", async (req: Request, res: Response) => {
    try {
        const result: QueryResult<any> = await query(`SELECT * FROM products`);

        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json(err);
    }
});

app.get("/order_mail", async (req: Request, res: Response) => {
    const data = {
        orderlines: [
            {
                orderline_id: 1,
                order_id: 123,
                product_id: 12,
                quantity: 1,
                net_price: 280000,
                title: "Dior Sauvage",
            },
            {
                orderline_id: 2,
                order_id: 123,
                product_id: 13,
                quantity: 1,
                net_price: 400000,
                title: "Channel X-V",
            },
            {
                orderline_id: 3,
                order_id: 123,
                product_id: 18,
                quantity: 1,
                net_price: 378000,
                title: "Gucci G&D",
            },
        ],
        order: {
            order_id: 123,
            order_date: "17/09/2023",
            tax: 0,
            delivery_cost: 29000,
            discount: 10,
            tmp_amount: 290000,
            amount: 400000,
        },
    };

    res.render("order_confirm", { data });
});

app.use("/", router);
app.use("/", paymentRoutes);

app.listen(PORT, () => {
    console.log("server is listening on port " + PORT);
});
