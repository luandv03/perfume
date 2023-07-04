import dotenv from "dotenv";
dotenv.config();

const env: NodeJS.ProcessEnv = process.env;

export const SECRET_KEY = env.SECRET_KEY as string;
