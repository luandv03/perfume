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

    private SECRET_KEY_ACCESS_TOKEN: string = this.env
        .SECRET_KEY_ACCESS_TOKEN as string;

    private EXPIRES_ACCESS_TOKEN: number = 60 * 60;

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
}
