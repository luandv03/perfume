import express, { Application } from "express";
import { Request, Response } from "express";
import { QueryResult } from "pg";
import cookieParser from "cookie-parser";
import cors from "cors";

import { query } from "./db/index.db";
import router from "./routes/index.routes";

const app: Application = express();
const PORT: number = 4000;

app.use(cors({ origin: "http://localhost:5173" }));

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

app.use("/", router);

app.listen(PORT, () => {
    console.log("server is listening on port " + PORT);
});
