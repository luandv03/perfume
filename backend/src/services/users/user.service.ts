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
import { HttpStatusCode } from "../../configs/httpStatusCode.config";
import { cartService } from "../carts/cart.service";

const configService = new ConfigService();

class UserService {
    async loginAccount(account: ILoginUser): Promise<ITokenUser | any> {
        try {
            const { email, password }: ILoginUser = account;

            const result: QueryResult<any> = await query(
                `SELECT * FROM system_account WHERE email = $1`,
                [email]
            );

            // rowCount: số lượng bản ghi trả về từ câu truy vấn
            if (!result.rowCount) {
                return {
                    statusCode: HttpStatusCode.NOT_FOUND,
                    message: "Not found",
                };
            }

            const isMatch = await bcrypt.compare(
                password,
                result.rows[0]?.password
            );

            if (!isMatch) {
                return {
                    statusCode: HttpStatusCode.NOT_FOUND,
                    message: "Username or Password incorrect",
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
                statusCode: HttpStatusCode.OK,
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
        try {
            const { email, password, phone_number, dob, fullname, address } =
                account;

            const results = await query(
                `SELECT * FROM customers WHERE email = $1`,
                [email]
            );

            if (results.rows.length) {
                return {
                    statusCode: HttpStatusCode.NOT_FOUND,
                    message: "Email already exist",
                };
            }

            const hashPassword: string = await bcrypt.hash(password, 10);

            const customer = await query(
                `INSERT INTO customers( email, fullname, phone_number, dob, address, auth_method) 
            VALUES ($1, $2, $3, $4, $5, $6, 'system') RETURNING customer_id`,
                [email, fullname, phone_number, dob, address]
            );

            await query(
                `INSERT INTO system_account(email, password, customer_id) VALUES ($1, $2, $3)`,
                [email, hashPassword, customer.rows[0].customer_id]
            );

            await cartService.createCart(customer.rows[0].customer_id);

            return {
                statusCode: HttpStatusCode.OK,
                message: "You have registed successfully",
            };
        } catch (error) {
            return {
                statusCode: HttpStatusCode.BAD_REQUEST,
                message: "Have error user",
                data: error,
            };
        }
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

    async loginWithGoogle(profile: {
        google_id: string;
        email: string;
        fullname: string;
    }): Promise<ResponseType<ITokenUser | any>> {
        try {
            const { google_id, email, fullname } = profile;

            const result = await query(
                `SELECT customer_id, auth_method FROM customers WHERE email = $1`,
                [email]
            );

            let customer_id: string = result.rows[0]?.customer_id;

            // check email này chưa tồn tại trong hệ thống
            // nếu chưa => tạo customer
            if (!customer_id) {
                await query("BEGIN");
                const account = await query(
                    `INSERT INTO customers(email, fullname, auth_method) VALUES($1, $2, 'google') RETURNING customer_id`,
                    [email, fullname]
                );

                await query(
                    `INSERT INTO google_account(customer_id, google_id) VALUES($1, $2)`,
                    [account.rows[0].customer_id, google_id]
                );

                await query("COMMIT");

                customer_id = account.rows[0].customer_id;
            }

            // check email này đã đăng nhập dưới 1 hình thức khác google
            if (result.rows[0] && result.rows[0]?.auth_method !== "google") {
                return {
                    statusCode: HttpStatusCode.NOT_FOUND,
                    message:
                        "Email này đã được đăng nhập bằng 1 hình thức khác google",
                };
            }

            // gooogle account này đã tồn tại trên hệ thống => trả về token cho customer đó
            const access_token_user = createToken<{
                customer_id: string;
            }>(
                {
                    customer_id,
                },
                configService.getSecretKeyAccessToken(),
                {
                    expiresIn: configService.getExpiresInAccessToken(),
                }
            );

            const refresh_token_user = createToken<{
                customer_id: string;
            }>(
                {
                    customer_id,
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
            await query("ROLLBACK");
            return {
                statusCode: HttpStatusCode.BAD_REQUEST,
                message: "Have error by user",
                data: err,
            };
        }
    }

    async loginWithFacebook(profile: {
        facebook_id: string;
        email: string;
        fullname: string;
    }): Promise<ResponseType<ITokenUser | any>> {
        try {
            const { facebook_id, email, fullname } = profile;

            const result = await query(
                `SELECT customer_id, auth_method FROM customers WHERE email = $1`,
                [email]
            );

            let customer_id: string = result.rows[0]?.customer_id;

            // check email này chưa tồn tại trong hệ thống
            // nếu chưa => tạo customer
            if (!customer_id) {
                await query("BEGIN");
                const account = await query(
                    `INSERT INTO customers(email, fullname, auth_method) VALUES($1, $2, 'facebook') RETURNING customer_id`,
                    [email, fullname]
                );

                await query(
                    `INSERT INTO facebook_account(customer_id, facebook_id) VALUES($1, $2)`,
                    [account.rows[0].customer_id, facebook_id]
                );

                await query("COMMIT");

                customer_id = account.rows[0].customer_id;
            }

            // check email này đã đăng nhập dưới 1 hình thức khác facebook
            if (result.rows[0] && result.rows[0]?.auth_method !== "facebook") {
                return {
                    statusCode: HttpStatusCode.NOT_FOUND,
                    message:
                        "Email này đã được đăng nhập bằng 1 hình thức khác facebook",
                };
            }

            // facebook account này đã tồn tại trên hệ thống => trả về token cho customer đó
            const access_token_user = createToken<{
                customer_id: string;
            }>(
                {
                    customer_id,
                },
                configService.getSecretKeyAccessToken(),
                {
                    expiresIn: configService.getExpiresInAccessToken(),
                }
            );

            const refresh_token_user = createToken<{
                customer_id: string;
            }>(
                {
                    customer_id,
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
            await query("ROLLBACK");
            return {
                statusCode: HttpStatusCode.BAD_REQUEST,
                message: "Have error by user",
                data: err,
            };
        }
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
