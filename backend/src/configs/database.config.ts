import { PoolConfig } from "pg";
import dotenv from "dotenv";
dotenv.config();

const env: NodeJS.ProcessEnv = process.env;

export const db_config: PoolConfig = {
    host: env.DB_HOST as string,
    port: Number(env.DB_PORT),
    database: env.DB_NAME as string,
    user: env.DB_USER as string,
    password: env.DB_PASSWORD as string,
};
