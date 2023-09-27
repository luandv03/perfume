"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configService = exports.ConfigService = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var ConfigService = /** @class */ (function () {
    function ConfigService() {
        this.env = process.env;
        this.DB_CONFIG = {
            host: this.env.DB_HOST,
            port: Number(this.env.DB_PORT),
            database: this.env.DB_NAME,
            user: this.env.DB_USER,
            password: this.env.DB_PASSWORD,
        };
        this.DOMAIN = this.env.DOMAIN;
        this.CLIENT_DOMAIN = this.env.CLIENT_DOMAIN;
        this.ADMIN_DOMAIN = this.env.ADMIN_DOMAIN;
        this.SECRET_KEY_ACCESS_TOKEN = this.env
            .SECRET_KEY_ACCESS_TOKEN;
        this.EXPIRES_ACCESS_TOKEN = 60 * 60 * 3; //3h // 60 60 3
        this.EXPIRES_REFRESH_TOKEN = 60 * 60 * 24 * 3;
        this.SECRET_KEY_REFRESH_TOKEN = this.env
            .SECRET_KEY_REFRESH_TOKEN;
    }
    ConfigService.prototype.getDbConfig = function () {
        return this.DB_CONFIG;
    };
    ConfigService.prototype.getSecretKeyAccessToken = function () {
        return this.SECRET_KEY_ACCESS_TOKEN;
    };
    ConfigService.prototype.getSecretKeyRefreshToken = function () {
        return this.SECRET_KEY_REFRESH_TOKEN;
    };
    ConfigService.prototype.getExpiresInAccessToken = function () {
        return this.EXPIRES_ACCESS_TOKEN;
    };
    ConfigService.prototype.getExpiresInRefreshToken = function () {
        return this.EXPIRES_REFRESH_TOKEN;
    };
    ConfigService.prototype.getGoogleClientId = function () {
        return this.env.GOOGLE_CLIENT_ID;
    };
    ConfigService.prototype.getGoogleClientSecret = function () {
        return this.env.GOOGLE_CLIENT_SECRET;
    };
    ConfigService.prototype.getFacebookClientId = function () {
        return this.env.FACEBOOK_CLIENT_ID;
    };
    ConfigService.prototype.getFacebookClientSecret = function () {
        return this.env.FACEBOOK_CLIENT_SECRET;
    };
    // config cloudinary to upload file
    ConfigService.prototype.getCloudName = function () {
        return this.env.CLD_CLOUD_NAME;
    };
    ConfigService.prototype.getCldApiKey = function () {
        return this.env.CLD_API_KEY;
    };
    ConfigService.prototype.getCldApiSecret = function () {
        return this.env.CLD_API_SECRET;
    };
    ConfigService.prototype.getCloudFolder = function () {
        return this.env.CLOUD_FOLDER;
    };
    // mailer
    ConfigService.prototype.getMailUser = function () {
        return this.env.MAIL_USER;
    };
    ConfigService.prototype.getMailPassword = function () {
        return this.env.MAIL_PASSWORD;
    };
    ConfigService.prototype.getMailHost = function () {
        return this.env.MAIL_HOST;
    };
    // frontend domain
    ConfigService.prototype.getClientDomain = function () {
        return this.CLIENT_DOMAIN;
    };
    ConfigService.prototype.getAdminDomain = function () {
        return this.ADMIN_DOMAIN;
    };
    ConfigService.prototype.getDomain = function () {
        return this.DOMAIN;
    };
    return ConfigService;
}());
exports.ConfigService = ConfigService;
exports.configService = new ConfigService();
