import { BaseService } from "./base.service";

class CategoryService extends BaseService {
    async getAllCategory() {
        try {
            const res = await this.httpClientPublic.get(`/category`);

            return res.data;
        } catch (error) {
            return error;
        }
    }

    // async getCategoryById() {}
}

export const categoryService: CategoryService = new CategoryService();
