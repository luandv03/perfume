import { BaseService } from "./base.service";

class AuthService extends BaseService {
    async login(email: string, password: string) {
        try {
            const res = await this.httpClientPublic.post("/api/auth/login", {
                email,
                password,
            });

            return res.data;
        } catch (error) {
            return error;
        }
    }

    async getProfile() {
        try {
            const res = await this.httpClientPrivate.get(
                "/api/auth/get_profile"
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }
}

export const authService: AuthService = new AuthService();
