import { Router } from "express";

import { MailerController } from "../../../controllers/mailers/mailer.controller";

const mailerRoutes = Router();
const mailerController = new MailerController();

mailerRoutes.post("/mailer/send", mailerController.sendMail);

export default mailerRoutes;
