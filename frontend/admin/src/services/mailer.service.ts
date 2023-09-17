import { BaseService } from "./base.service";

class MailerService extends BaseService {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async sendMail(to: string, data: any) {
        try {
            const res = await this.httpClientPrivate.post("/mailer/send", {
                to,
                data,
            });

            return res.data;
        } catch (error) {
            return error;
        }
    }
}

export const mailerService = new MailerService();
