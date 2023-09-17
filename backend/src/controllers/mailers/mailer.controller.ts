import { Request, Response } from "express";

import { mailerService } from "../../services/mailers/mailer.service";

export class MailerController {
    async sendMail(req: Request, res: Response): Promise<any> {
        try {
            const dataOrder = req.body.data;
            const to = req.body.to;

            const data = await mailerService.sendMail(
                {
                    from: "<No reply> dinhvanluan2k3@gmail.com",
                    subject: "Đặt hàng thành công",
                    to,
                    text: "Hello world?", // plain text body
                },
                dataOrder
            );

            res.status(data.statusCode).json(data);
            return;
        } catch (error) {
            res.status(500).json({
                statusCode: 500,
                message: "INTERNAL SERVER ERROR",
                error: error,
            });
        }
    }
}
