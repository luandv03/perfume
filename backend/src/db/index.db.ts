import { Pool } from "pg";

import { ConfigService } from "../configs/configService.config";

const configService = new ConfigService();

const db: Pool = new Pool(configService.getDbConfig());

export const query = async (query: string, params?: any[]) => {
    if (params) {
        return await db.query(query, params);
    }

    return await db.query(query);
};
