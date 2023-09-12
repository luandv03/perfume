import { BaseService } from "./base.service";

class AuthService extends BaseService {
    async login({
        username,
        password,
    }: {
        username: string;
        password: string;
    }) {
        try {
            const res = await this.httpClientPublic.post(
                "/admin/account/login",
                {
                    username,
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
                "/admin/account/get_profile"
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }

    async logout() {
        try {
            const res = await this.httpClientPrivate.post(
                "/admin/account/logout"
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }
}

export const authService: AuthService = new AuthService();
