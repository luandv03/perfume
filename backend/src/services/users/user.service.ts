import { QueryResult } from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { query } from "../../db/index.db";
import { ITokenUser } from "../../types/users/user.type";
import { ConfigService } from "../../configs/configService.config";
import { createToken } from "../../utils/create_token.util";
import { ResponseType } from "../../types/response.type";
import { UserProfileType } from "../../types/users/user.type";
import { ILoginUser } from "../../types/users/user.type";
import { IRegisterUser } from "../../types/users/user.type";

const configService = new ConfigService();

class UserService {
    async loginAccount(account: ILoginUser): Promise<ITokenUser | any> {
        try {
            const { email, password }: ILoginUser = account;

            const result: QueryResult<any> = await query(
                `SELECT * FROM customers WHERE email = $1`,
                [email]
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

            const access_token_user = createToken<{
                customer_id: string;
            }>(
                {
                    customer_id: result.rows[0]?.customer_id,
                },
                configService.getSecretKeyAccessToken(),
                {
                    expiresIn: configService.getExpiresInAccessToken(),
                }
            );

            const refresh_token_user = createToken(
                {
                    customer_id: result.rows[0]?.customer_id,
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
                    access_token_user,
                    refresh_token_user,
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

    async registerAccount(account: IRegisterUser): Promise<ResponseType<any>> {
        const { email, password, phone_number, dob, fullname, address } =
            account;

        const results = await query(`SELECT * FROM users WHERE email = $1`, [
            email,
        ]);

        if (results.rows.length) {
            return {
                statusCode: 406,
                message: "eMail already exist",
            };
        }

        const hashPassword: string = await bcrypt.hash(password, 10);

        await query(
            `INSERT INTO users( email, username, password, phone_number, birth_year, address) VALUES ($1, $2, $3, $4, $5, $6)`,
            [email, fullname, hashPassword, phone_number, dob, address]
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

    async getProfile(
        customer_id: number
    ): Promise<ResponseType<UserProfileType>> {
        const results = await query(
            `SELECT customer_id, email, fullname, address, phone_number, dob FROM customers WHERE customer_id = $1`,
            [customer_id]
        );

        if (!results.rows.length) {
            return {
                statusCode: 404,
                message: "User not exist",
            };
        }

        return {
            statusCode: 200,
            message: "Get Profile Successfull",
            data: results.rows[0],
        };
    }
}

export const userService = new UserService();
