import { QueryResult } from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";

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
import { mailerService } from "../mailers/mailer.service";
import { generatePasswordRandom } from "../../utils/generatePasswordRandom.util";
import { geneateOtp } from "../../utils/generateOtp.util";

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

            await query(`BEGIN`);

            const customer = await query(
                `INSERT INTO customers( email, fullname, phone_number, dob, address, auth_method) 
            VALUES ($1, $2, $3, $4, $5, 'system') RETURNING customer_id`,
                [email, fullname, phone_number, dob, address]
            );

            await query(
                `INSERT INTO system_account(email, password, customer_id) VALUES ($1, $2, $3)`,
                [email, hashPassword, customer.rows[0].customer_id]
            );

            await cartService.createCart(customer.rows[0].customer_id);

            await query(`COMMIT`);

            return {
                statusCode: HttpStatusCode.OK,
                message: "You have registed successfully",
            };
        } catch (error) {
            await query(`ROLLBACK`);
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

        const access_token_user = createToken<{ customer_id: string }>(
            {
                customer_id: decoded.customer_id,
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
                access_token_user,
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

                // sau khi đăng ký tài khoản thành công thì tự động tạo cart
                await cartService.createCart(Number(customer_id));
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

                // sau khi đăng ký thành công thì tự động tạo cart
                await cartService.createCart(Number(customer_id));
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
            `SELECT customer_id, email, fullname, address, phone_number, dob, auth_method FROM customers WHERE customer_id = $1`,
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

    // get customers : role admin
    async getCustomers(
        type: string,
        page: number,
        limit: number
    ): Promise<ResponseType<any>> {
        const offset = (page - 1) * limit;

        // type = all (both bought and not buy)
        let results, n_customers;
        if (type === "all") {
            results = await query(
                `with tmp_4 as (
            with tmp_3 as (
            with tmp_2 as (
                            with tmp as (
                            select order_id, customer_id, tax, delivery_cost, sum(quantity*net_price) tam_tinh , order_date from orders
                            join orderlines using(order_id)
                            group by order_id
                        )
                        select tmp.order_id, customer_id, tax, delivery_cost, tam_tinh,   sum(COALESCE(cp.coupon_discount,0)) as tong_giam_gia, order_date
                        from tmp
                        left join coupon_orders cpo on tmp.order_id = cpo.order_id
                        left join coupons cp on cp.coupon_id = cpo.coupon_id
                        group by tmp.order_id, customer_id, tax, delivery_cost, tam_tinh, order_date
                    )
                    select order_id, customer_id, tax, delivery_cost, tong_giam_gia, order_date, tam_tinh*(1-(tong_giam_gia::float)/100)*(1 + (tax::float)/100) + delivery_cost as tong_hoa_don
                    from tmp_2 order by customer_id, order_id
            ) select customer_id, count(order_id) n_orders , sum(tong_hoa_don) total_spent from tmp_3 
            group by customer_id)
            select c.customer_id, COALESCE(n_orders, 0) n_orders, COALESCE(total_spent, 0) total_spent, c.fullname, c.address, c.email, c.dob from tmp_4
            right join customers c using(customer_id)
            ORDER BY customer_id
            OFFSET $1 LIMIT $2
            `,
                [offset, limit]
            );

            n_customers = await this.countCustomers("all");
        } else if (type === "yes") {
            results = await query(
                `with tmp_4 as (
            with tmp_3 as (
            with tmp_2 as (
                            with tmp as (
                            select order_id, customer_id, tax, delivery_cost, sum(quantity*net_price) tam_tinh , order_date from orders
                            join orderlines using(order_id)
                            group by order_id
                        )
                        select tmp.order_id, customer_id, tax, delivery_cost, tam_tinh,   sum(COALESCE(cp.coupon_discount,0)) as tong_giam_gia, order_date
                        from tmp
                        left join coupon_orders cpo on tmp.order_id = cpo.order_id
                        left join coupons cp on cp.coupon_id = cpo.coupon_id
                        group by tmp.order_id, customer_id, tax, delivery_cost, tam_tinh, order_date
                    )
                    select order_id, customer_id, tax, delivery_cost, tong_giam_gia, order_date, tam_tinh*(1-(tong_giam_gia::float)/100)*(1 + (tax::float)/100) + delivery_cost as tong_hoa_don
                    from tmp_2 order by customer_id, order_id
            ) select customer_id, count(order_id) n_orders , sum(tong_hoa_don) total_spent from tmp_3 
            group by customer_id)
            select c.customer_id, COALESCE(n_orders, 0) n_orders, COALESCE(total_spent, 0) total_spent, c.fullname, c.address, c.email, c.dob from tmp_4
            join customers c using(customer_id)
            ORDER BY customer_id
            OFFSET $1 LIMIT $2
            `,
                [offset, limit]
            );

            n_customers = await this.countCustomers("yes");
        } else if (type === "no") {
            results = await query(
                `SELECT c.customer_id, c.fullname, c.address, c.email, c.dob, 0 n_orders, 0 total_spent FROM customers c
                WHERE customer_id NOT IN (select customer_id from orders)
                ORDER BY customer_id
                OFFSET $1 LIMIT $2
            `,
                [offset, limit]
            );

            n_customers = await this.countCustomers("no");
        }

        return {
            statusCode: HttpStatusCode.OK,
            message: "Get customers successfully",
            data: {
                customers: results?.rows,
                page: page,
                limit: limit,
                totalPage: n_customers && Math.ceil(n_customers / limit),
                totalCustomer: n_customers,
            },
        };
    }

    async getCustomerById(customer_id: number): Promise<ResponseType<any>> {
        const results = await query(
            `SELECT * FROM customers WHERE customer_id = $1`,
            [customer_id]
        );

        if (!results.rowCount) {
            return {
                statusCode: HttpStatusCode.NOT_FOUND,
                message: "Get customer failed",
                data: {},
            };
        }

        return {
            statusCode: HttpStatusCode.OK,
            message: "Get customer successfully",
            data: results.rows[0],
        };
    }

    async countCustomers(type: string): Promise<number> {
        let results;

        if (type === "all") {
            results = await query(`SELECT count(*) n_customers FROM customers`);
        } else if (type === "yes") {
            // list customers who ordered
            results = await query(
                `SELECT count(*) n_customers FROM customers 
                WHERE customer_id IN (select customer_id from orders)`
            );
        } else if (type === "no") {
            results = await query(
                `SELECT count(*) n_customers FROM customers 
                WHERE customer_id NOT IN (select customer_id from orders)`
            );
        }

        return Number(results?.rows[0].n_customers);
    }

    async updateProfileCustomer(
        customer_id: number,
        {
            fullname,
            dob,
            address,
            phone_number,
        }: {
            fullname: string;
            dob: string;
            address: string;
            phone_number: string;
        }
    ): Promise<ResponseType<any>> {
        if (!fullname || !dob || !phone_number || !address) {
            return {
                statusCode: HttpStatusCode.BAD_REQUEST,
                message: "Please fill in all field",
            };
        }

        const result = await query(
            `UPDATE customers SET fullname = $1, dob = $2, address = $3, phone_number = $4 
             WHERE customer_id = $5 RETURNING *`,
            [fullname, dob, address, phone_number, customer_id]
        );

        return {
            statusCode: HttpStatusCode.OK,
            message: "Update profile successfull",
            data: result.rows[0],
        };
    }

    async sendOtpToEmail(email: string): Promise<ResponseType<any>> {
        const checkUser = await query(
            `SELECT customer_id FROM system_account WHERE email = $1`,
            [email]
        );

        if (!checkUser.rowCount) {
            return {
                statusCode: HttpStatusCode.NOT_FOUND,
                message: "User not exists",
            };
        }

        const checkOtp = await query(
            `SELECT * FROM otp WHERE customer_id = $1`,
            [checkUser.rows[0].customer_id]
        );

        if (checkOtp.rowCount) {
            await query(`DELETE FROM otp WHERE otp_id = $1`, [
                checkOtp.rows[0].otp_id,
            ]);
        }

        // create new otp
        const newOtp = geneateOtp();
        const hash = await bcrypt.hash(newOtp, 10);

        const result = await query(
            `INSERT INTO otp VALUES(DEFAULT, $1, $2, $3) RETURNING *`,
            [checkUser.rows[0].customer_id, hash, Date.now() + 30 * 60 * 1000] // 30 minutes
        );

        if (!result.rowCount) {
            return {
                statusCode: HttpStatusCode.BAD_REQUEST,
                message: "Create otp failed",
            };
        }

        const data = await mailerService.sendMail(
            {
                from: "<No reply> dinhvanluan2k3@gmail.com",
                subject: "Yêu cầu khôi phục mật khẩu PERFUME LDA",
                to: email,
                text: "Hello world?", // plain text body
                html: "otp",
            },
            { otp: newOtp }
        );

        return {
            statusCode: HttpStatusCode.OK,
            message: "Send otp success",
            data: data,
        };
    }

    async confirmOtpAndSendNewPassword(
        email: string,
        otp: string
    ): Promise<ResponseType<any>> {
        const checkUser = await query(
            `SELECT customer_id FROM system_account WHERE email = $1`,
            [email]
        );

        if (!checkUser.rowCount) {
            return {
                statusCode: HttpStatusCode.NOT_FOUND,
                message: "User not exists",
            };
        }

        const checkOtp = await query(
            `SELECT * FROM otp WHERE customer_id = $1`,
            [checkUser.rows[0].customer_id]
        );

        if (!checkOtp.rowCount) {
            return {
                statusCode: HttpStatusCode.NOT_FOUND,
                message: "OTP not exist",
            };
        }

        const isValid: boolean = await bcrypt.compare(
            otp,
            checkOtp.rows[0].otp_code
        );

        if (!isValid) {
            return {
                statusCode: HttpStatusCode.NOT_ACCEPTABLE,
                message: "Invalid OTP",
            };
        }

        if (checkOtp.rows[0].expired < Date.now()) {
            return {
                statusCode: HttpStatusCode.NOT_ACCEPTABLE,
                message: "OTP expired",
            };
        }

        // check all condition ok -> reset password
        const newPassword = generatePasswordRandom(10);

        const hashNewPassword = await bcrypt.hash(newPassword, 10);

        await query(
            `UPDATE system_account SET password = $1 WHERE customer_id = $2`,
            [hashNewPassword, checkUser.rows[0].customer_id]
        );

        const data = await mailerService.sendMail(
            {
                from: "<No reply> dinhvanluan2k3@gmail.com",
                subject: "Yêu cầu đổi mật khẩu PERFUME LDA",
                to: email,
                text: "Hello world?", // plain text body
                html: "reset_password",
            },
            { newPassword }
        );

        return {
            statusCode: HttpStatusCode.OK,
            message: "Reset password success",
            data: data,
        };
    }

    async resetPassword(
        customer_id: number,
        password: string,
        newPassword: string,
        confirmNewPassword: string
    ): Promise<ResponseType<any>> {
        const checkPassword = await query(
            `SELECT password FROM system_account WHERE customer_id = $1`,
            [customer_id]
        );

        const isMatch = await bcrypt.compare(
            password,
            checkPassword.rows[0].password
        );

        if (!isMatch) {
            return {
                statusCode: HttpStatusCode.BAD_REQUEST,
                message: "Current password not match",
            };
        }

        if (newPassword !== confirmNewPassword) {
            return {
                statusCode: HttpStatusCode.BAD_REQUEST,
                message: "New password not match with confirm password",
            };
        }

        const hashNewPassword = await bcrypt.hash(newPassword, 10);

        await query(
            `UPDATE system_account SET password = $1 WHERE customer_id = $2`,
            [hashNewPassword, customer_id]
        );

        return {
            statusCode: HttpStatusCode.OK,
            message: "Reset password success",
        };
    }
}

export const userService = new UserService();
