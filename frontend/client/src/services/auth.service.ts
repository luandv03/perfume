import { BaseService } from "./base.service";

interface RegisterAccount {
    fullname: string;
    password: string;
    phone_number: string;
    address: string;
    email: string;
    dob: string;
}

class AuthService extends BaseService {
    async register({
        fullname,
        password,
        phone_number,
        address,
        email,
        dob,
    }: RegisterAccount) {
        try {
            const res = await this.httpClientPublic.post(
                "/auth/customer/register",
                {
                    fullname,
                    password,
                    phone_number,
                    address,
                    email,
                    dob,
                }
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }

    async login({ email, password }: { email: string; password: string }) {
        try {
            const res = await this.httpClientPublic.post(
                "/auth/customer/login",
                {
                    email,
                    password,
                }
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }

    async loginWithGoogle() {
        try {
            const res = await this.httpClientPublic.get("auth/google/login");

            return res.data;
        } catch (error) {
            return error;
        }
    }

    async loginWithFacebook() {
        try {
            const res = await this.httpClientPublic.get("/auth/facebook/login");

            return res.data;
        } catch (error) {
            return error;
        }
    }

    async getProfile() {
        try {
            const res = await this.httpClientPrivate.get(
                "/auth/customer/profile"
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }

    async logout() {
        try {
            const res = await this.httpClientPrivate.post(
                "/auth/customer/logout"
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }

    async updateProfile({
        fullname,
        phone_number,
        address,
        dob,
    }: {
        fullname: string;
        phone_number: string;
        address: string;
        dob: string;
    }) {
        try {
            const res = await this.httpClientPrivate.patch(
                "/customer/profile/update",
                { fullname, phone_number, address, dob }
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }

    // post("/customer/forgot_password/otp/send",
    async sendOtpToEmail(email: string) {
        try {
            const res = await this.httpClientPublic.post(
                "/customer/forgot_password/otp/send",
                { email }
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }

    // confirm otp and reset password
    // post("/customer/forgot_password/otp/confirm",
    async confirmOtpAndSendNewPassword(email: string, otp: string) {
        try {
            const res = await this.httpClientPublic.post(
                "/customer/forgot_password/otp/confirm",
                { email, otp }
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }
}

export const authService: AuthService = new AuthService();
