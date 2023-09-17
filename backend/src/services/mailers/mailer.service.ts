import nodemailer from "nodemailer";

import { HttpStatusCode } from "../../configs/httpStatusCode.config";
import { ResponseType } from "../../types/response.type";

interface MailerType {
    from: string;
    to: string;
    text: string;
    subject: string;
    html: string;
}

class MailerService {
    private transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: "dinhvanluan2k3@gmail.com",
            pass: "milyuglwcxbmsgoq",
        },
    });

    // const info = await transporter.sendMail({
    //     from: '"Fred Foo 👻" <foo@example.com>', // sender address
    //     to: "bar@example.com, baz@example.com", // list of receivers
    //     subject: "Hello ✔", // Subject line
    //     text: "Hello world?", // plain text body
    //     html: "<b>Hello world?</b>", // html body
    //   });

    public async sendMail({
        from,
        to,
        text,
        subject,
        html,
    }: MailerType): Promise<ResponseType<any>> {
        return await this.transporter
            .sendMail({
                from,
                to,
                text,
                subject,
                html,
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
