import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import jade from "jade";

import { HttpStatusCode } from "../../configs/httpStatusCode.config";
import { ResponseType } from "../../types/response.type";
import { configService } from "../../configs/configService.config";

interface MailerType {
    from: string;
    to: string;
    text: string;
    subject: string;
}

class MailerService {
    private transporter = nodemailer.createTransport({
        host: configService.getMailHost(),
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: configService.getMailUser(),
            pass: configService.getMailPassword(),
        },
    });

    public async sendMail(
        { from, to, text, subject }: MailerType,
        data: any
    ): Promise<ResponseType<any>> {
        const __dirname = path.resolve();
        const filePath = path.join(__dirname, "/src/views/order_confirm.jade");
        const source = fs.readFileSync(filePath, "utf-8").toString();
        const template = jade.compile(source);
        const htmlToSend = template({ data });

        return await this.transporter
            .sendMail({
                from,
                to,
                text,
                subject,
                html: htmlToSend,
            })
            .then((response) => ({
                statusCode: HttpStatusCode.OK,
                message: "Send mail ok",
                data: response,
            }))
            .catch((error) => {
                console.log(error);
                return {
                    statusCode: HttpStatusCode.BAD_REQUEST,
                    message: "Send mail failed",
                    data: error,
                };
            });
    }
}

export const mailerService = new MailerService();
