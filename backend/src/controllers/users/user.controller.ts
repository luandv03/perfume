import { Request, Response, NextFunction } from "express";

import { userService } from "../../services/users/user.service";
// import { IRegisterAccount } from "../../types/admins/register-account.type";
import { handleErrorDto } from "../../utils/handle_error_dto.util";
import { ResponseType } from "../../types/response.type";
import { LoginUserAccountDto } from "../../dtos/users/user.dto";
import { HttpStatusCode } from "../../configs/httpStatusCode.config";
import { configService } from "../../configs/configService.config";

export class UserController {
    async register(req: Request, res: Response): Promise<any> {
        try {
            const {
                fullname,
                password,
                phone_number,
                address,
                email,
                dob,
            }: any = req.body;

            // validate dữ liệu đầu vào nhờ DTO
            // const errorResult: ResponseType<any> = await handleErrorDto<{
            //     username: string;
            //     password: string;
            //     phone_number: string;
            //     address: string;
            //     mail: string;
            //     birth_year: string;
            // }>(
            //     { username, password, phone_number, address, birth_year, mail },
            //     new RegisterUserAccountDto()
            // );

            // if (errorResult.statusCode) {
            //     return res.status(errorResult.statusCode).json(errorResult);
            // }

            const data = await userService.registerAccount({
                fullname,
                password,
                phone_number,
                email,
                dob,
                address,
            });
            return res.status(data.statusCode).json(data);
        } catch (err) {
            return res.status(500).json({
                statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
                message: "Internal Server Error",
                err,
            });
        }
    }

    async login(req: Request, res: Response): Promise<any> {
        try {
            const { email, password } = req.body;

            // validate dữ liệu đầu vào nhờ DTO
            const errorResult: ResponseType<any> = await handleErrorDto<{
                email: string;
                password: string;
            }>({ email, password }, new LoginUserAccountDto());

            if (errorResult.statusCode) {
                return res.status(errorResult.statusCode).json(errorResult);
            }

            const data = await userService.loginAccount({
                email,
                password,
            });

            return res.status(data.statusCode).json(data);
        } catch (err) {
            console.log(err);
            res.status(500).json({ err: err });
        }
    }

    refreshToken(req: Request, res: Response) {
        try {
            let refresh_token_user: string = req.headers[
                "authorization"
            ] as string;

            if (refresh_token_user.startsWith("Bearer ")) {
                refresh_token_user = refresh_token_user.slice(
                    7,
                    refresh_token_user.length
                );
            }

            if (!refresh_token_user) {
                return res.status(403).json({
                    statusCode: 403,
                    message: "Refresh token not valid",
                });
            }

            const data = userService.refreshTokenService(refresh_token_user);

            res.status(data.statusCode).json(data);
        } catch (err) {
            res.status(400).json({
                error: err,
            });
        }
    }

    async loginWithGoolge(req: Request, res: Response): Promise<any> {
        try {
            const { id, email, displayName } = req?.user as {
                id: string;
                email: string;
                displayName: string;
            };

            const data = await userService.loginWithGoogle({
                google_id: id,
                email,
                fullname: displayName,
            });

            res.redirect(
                `${configService.getClientDomain()}/login/success?access_token_user=${
                    data.data.access_token_user
                }&refresh_token_user=${data.data.refresh_token_user}`
            );

        } catch (err) {
            return res.status(500).json({
                statusCode: 500,
                message: err,
            });
        }
    }

    async loginWithFacebook(req: Request, res: Response): Promise<any> {
        try {
            const { id, email, displayName } = req.user as {
                id: string;
                email: string;
                displayName: string;
            };

            const data = await userService.loginWithFacebook({
                facebook_id: id,
                email,
                fullname: displayName,
            });

            res.redirect(
                `${configService.getClientDomain()}/login/success?access_token_user=${
                    data.data.access_token_user
                }&refresh_token_user=${data.data.refresh_token_user}`
            );

        } catch (err) {
            return res.status(500).json({
                statusCode: 500,
                message: err,
            });
        }
    }

    logout(req: Request, res: Response) {
        try {
            // res.clearCookie("access_token_user");
            // res.clearCookie("refresh_token_user");

            return res.status(200).json({
                statusCode: 200,
                message: "Logout successfully",
            });
        } catch (err) {
            return res.status(500).json({
                statusCode: 500,
                message: err,
            });
        }
    }

    async getProfile(req: Request, res: Response): Promise<any> {
        try {
            const { customer_id } = res.locals.data;
            const data = await userService.getProfile(customer_id);

            return res.status(data.statusCode).json(data);
        } catch (err) {
            res.status(500).json({
                statusCode: 500,
                message: err,
            });
        }
    }

    async getCustomers(req: Request, res: Response): Promise<any> {
        try {
            const { type, page, limit } = req.query;
            const data = await userService.getCustomers(
                type as string,
                Number(page),
                Number(limit)
            );

            return res.status(data.statusCode).json(data);
        } catch (err) {
            res.status(500).json({
                statusCode: 500,
                message: err,
            });
        }
    }

    async getCustomerById(req: Request, res: Response): Promise<any> {
        try {
            const { customer_id } = req.params;
            const data = await userService.getCustomerById(Number(customer_id));

            return res.status(data.statusCode).json(data);
        } catch (err) {
            res.status(500).json({
                statusCode: 500,
                message: err,
            });
        }
    }

    async updateProfile(req: Request, res: Response): Promise<any> {
        try {
            const { customer_id } = res.locals.data;
            const { fullname, dob, address, phone_number } = req.body;

            const data = await userService.updateProfileCustomer(customer_id, {
                fullname,
                dob,
                address,
                phone_number,
            });

            return res.status(data.statusCode).json(data);
        } catch (error) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
                message: "Internal server error",
                error: error,
            });
        }
    }

    async sendOtpToEmail(req: Request, res: Response): Promise<any> {
        try {
            const { email } = req.body;

            const data = await userService.sendOtpToEmail(email);

            return res.status(data.statusCode).json(data);
        } catch (error) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
                message: "Internal server error",
                error: error,
            });
        }
    }

    async confirmOtpAndSendNewPassword(
        req: Request,
        res: Response
    ): Promise<any> {
        try {
            const { email, otp } = req.body;

            const data = await userService.confirmOtpAndSendNewPassword(
                email,
                otp
            );

            return res.status(data.statusCode).json(data);
        } catch (error) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
                message: "Internal server error",
                error: error,
            });
        }
    }

    async resetPassword(req: Request, res: Response): Promise<any> {
        try {
            const { customer_id } = res.locals.data;
            const { password, newPassword, confirmNewPassword } = req.body;

            const data = await userService.resetPassword(
                customer_id,
                password,
                newPassword,
                confirmNewPassword
            );

            return res.status(data.statusCode).json(data);
        } catch (error) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
                message: "Internal server error",
                error: error,
            });
        }
    }
}
