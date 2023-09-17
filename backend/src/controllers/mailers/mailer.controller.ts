import { Request, Response } from "express";

import { mailerService } from "../../services/mailers/mailer.service";

export class MailerController {
    async sendMail(req: Request, res: Response): Promise<any> {
        try {
            const email = req.body.email;

            console.log(email);

            const data = await mailerService.sendMail({
                from: "<No reply> dinhvanluan2k3@gmail.com",
                subject: "Mua hang thanh cong",
                to: email,
                text: "Hello world?", // plain text body
                html: "<div>Hello world <div>",
            });

            res.status(data.statusCode).json(data);
        } catch (error) {
            res.status(500).json({
                statusCode: 500,
                message: "INTERNAL SERVER ERROR",
                error: error,
            });
        }
    }
}
