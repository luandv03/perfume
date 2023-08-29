import { BaseService } from "./base.service";

class CategoryService extends BaseService {
    async getAllCategories() {
        try {
            const res = await this.httpClientPublic.get(`/category`);

            return res.data;
        } catch (error) {
            return error;
        }
    }
}

export const categoryService: CategoryService = new CategoryService();
