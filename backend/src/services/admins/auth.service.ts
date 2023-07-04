import { QueryResult } from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { query } from "../../db/index.db";
import { IAdmin } from "../../types/admins/admins.type";
import { IRegisterAccount } from "../../types/admins/register-account.type";
import { ILoginAccount } from "../../types/admins/login-account.type";
import { IToken } from "../../types/admins/login-account.type";
import { ConfigService } from "../../configs/configService.config";
import { createToken } from "../../utils/create_token.util";
import { ResponseType } from "../../types/response.type";

const configService = new ConfigService();

class AdminService {
    async getAdmins(): Promise<IAdmin[]> {
        const result: QueryResult<any> = await query(
            `SELECT admin_id, username, phone_number, role FROM admins`
        );

        return result.rows;
    }

    async loginAccount(account: ILoginAccount): Promise<IToken | any> {
        try {
            const { username, password }: ILoginAccount = account;

            const result: QueryResult<any> = await query(
                `SELECT * FROM admins WHERE username = $1`,
                [username]
            );

            // rowCount: số lượng bản ghi trả về từ câu truy vấn
            if (!result.rowCount) {
                return {
                    statusCode: 404,
                    message: "Not found",
                };
            }

            const isMatch = await bcrypt.compare(
                password,
                result.rows[0]?.password
            );

            if (!isMatch) {
                return {
                    statusCode: 404,
                    message: "Username or Password not matches",
                };
            }

            const access_token = createToken<{
                admin_id: string;
                role: string;
            }>(
                {
                    admin_id: result.rows[0]?.admin_id,
                    role: result.rows[0]?.role,
                },
                configService.getSecretKeyAccessToken(),
                {
                    expiresIn: configService.getExpiresInAccessToken(),
                }
            );

            const refresh_token = createToken(
                {
                    admin_id: result.rows[0]?.admin_id,
                    role: result.rows[0]?.role,
                },
                configService.getSecretKeyRefreshToken(),
                {
                    expiresIn: configService.getExpiresInRefreshToken(),
                }
            );

            return {
                statusCode: 200,
                message: "Login successfull",
                data: {
                    access_token,
                    refresh_token,
                    EXPIRES_ACCESS_TOKEN:
                        configService.getExpiresInAccessToken(),
                    EXPIRES_REFRESH_TOKEN:
                        configService.getExpiresInRefreshToken(),
                },
            };
        } catch (err) {
            return err;
        }
    }

    async registerAccount(
        account: IRegisterAccount
    ): Promise<ResponseType<any>> {
        const { username, password, phone_number, role } = account;

        const results = await query(
            `SELECT * FROM admins WHERE username = $1`,
            [username]
        );

        if (results.rows[0]) {
            return {
                statusCode: 406,
                message: "Username already exist",
            };
        }

        const hashPassword: string = await bcrypt.hash(password, 10);

        await query(
            `INSERT INTO admins(username, password, phone_number, role) VALUES ($1, $2, $3, $4) `,
            [username, hashPassword, phone_number, role]
        );

        return {
            statusCode: 201,
            message: "You have registed successfully",
        };
    }

    refreshTokenService(token: string): any {
        const decoded: any = jwt.verify(
            token,
            configService.getSecretKeyRefreshToken()
        );

        if (!decoded) {
            return {
                statusCode: 401,
                message: "Invalid token",
            };
        }

        const access_token = createToken<{ admin_id: string; role: string }>(
            {
                admin_id: decoded.admin_id,
                role: decoded.role,
            },
            configService.getSecretKeyAccessToken(),
            {
                expiresIn: configService.getExpiresInAccessToken(),
            }
        );

        return {
            statusCode: 201,
            message: "refesh token successfull",
            data: {
                access_token,
                EXPIRES_ACCESS_TOKEN: configService.getExpiresInAccessToken(),
            },
        };
    }
}

export const adminService = new AdminService();
