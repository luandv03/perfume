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

    async updateCategoryById(category_id: number, category_name: string) {
        try {
            const res = await this.httpClientPublic.put(
                `/category/${category_id}/update`,
                {
                    category_name,
                }
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }

    async createCategory(category_name: string) {
        try {
            const res = await this.httpClientPublic.post(`/category/create`, {
                category_name,
            });

            return res.data;
        } catch (error) {
            return error;
        }
    }

    async deleteCategoryById(category_id: number) {
        try {
            const res = await this.httpClientPublic.delete(
                `/category/${category_id}/delete`
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }
}

export const categoryService: CategoryService = new CategoryService();
