import { PoolConfig } from "pg";

import dotenv from "dotenv";
dotenv.config();

export class ConfigService {
    protected env: NodeJS.ProcessEnv = process.env;

    private DB_CONFIG: PoolConfig = {
        host: this.env.DB_HOST as string,
        port: Number(this.env.DB_PORT),
        database: this.env.DB_NAME as string,
        user: this.env.DB_USER as string,
        password: this.env.DB_PASSWORD as string,
    };

    private DOMAIN: string = this.env.DOMAIN as string;

    private CLIENT_DOMAIN: string = this.env.CLIENT_DOMAIN as string;

    private ADMIN_DOMAIN: string = this.env.ADMIN_DOMAIN as string;

    private SERVER_DOMAIN: string = this.env.SERVER_DOMAIN as string;

    private SECRET_KEY_ACCESS_TOKEN: string = this.env
        .SECRET_KEY_ACCESS_TOKEN as string;

    private EXPIRES_ACCESS_TOKEN: number = 60 * 60 * 3; //3h // 60 60 3

    private EXPIRES_REFRESH_TOKEN: number = 60 * 60 * 24 * 3;

    private SECRET_KEY_REFRESH_TOKEN: string = this.env
        .SECRET_KEY_REFRESH_TOKEN as string;

    public getDbConfig(): PoolConfig {
        return this.DB_CONFIG;
    }

    public getSecretKeyAccessToken(): string {
        return this.SECRET_KEY_ACCESS_TOKEN;
    }

    public getSecretKeyRefreshToken(): string {
        return this.SECRET_KEY_REFRESH_TOKEN;
    }

    public getExpiresInAccessToken(): number {
        return this.EXPIRES_ACCESS_TOKEN;
    }

    public getExpiresInRefreshToken(): number {
        return this.EXPIRES_REFRESH_TOKEN;
    }

    public getGoogleClientId(): string {
        return this.env.GOOGLE_CLIENT_ID as string;
    }

    public getGoogleClientSecret(): string {
        return this.env.GOOGLE_CLIENT_SECRET as string;
    }

    public getFacebookClientId(): string {
        return this.env.FACEBOOK_CLIENT_ID as string;
    }

    public getFacebookClientSecret(): string {
        return this.env.FACEBOOK_CLIENT_SECRET as string;
    }

    // config cloudinary to upload file
    public getCloudName(): string {
        return this.env.CLD_CLOUD_NAME as string;
    }

    public getCldApiKey(): string {
        return this.env.CLD_API_KEY as string;
    }

    public getCldApiSecret(): string {
        return this.env.CLD_API_SECRET as string;
    }

    public getCloudFolder(): string {
        return this.env.CLOUD_FOLDER as string;
    }

    // mailer
    public getMailUser(): string {
        return this.env.MAIL_USER as string;
    }

    public getMailPassword(): string {
        return this.env.MAIL_PASSWORD as string;
    }

    public getMailHost(): string {
        return this.env.MAIL_HOST as string;
    }

    // frontend domain
    public getClientDomain(): string {
        return this.CLIENT_DOMAIN;
    }

    public getAdminDomain(): string {
        return this.ADMIN_DOMAIN;
    }

    public getDomain(): string {
        return this.DOMAIN;
    }

    public getServerDomain(): string {
        return this.SERVER_DOMAIN;
    }
}

export const configService = new ConfigService();
