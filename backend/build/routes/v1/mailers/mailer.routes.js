"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var mailer_controller_1 = require("../../../controllers/mailers/mailer.controller");
var mailerRoutes = (0, express_1.Router)();
var mailerController = new mailer_controller_1.MailerController();
mailerRoutes.post("/mailer/send", mailerController.sendMail);
exports.default = mailerRoutes;
