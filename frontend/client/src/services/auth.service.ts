import { BaseService } from "./base.service";

class AuthService extends BaseService {
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
}

export const authService: AuthService = new AuthService();
