import { ResponseType } from "../../types/response.type";
import { query } from "../../db/index.db";
import { HttpStatusCode } from "../../configs/httpStatusCode.config";
import { CategoryType } from "../../types/categories/category.type";

class CategoryService {
    async createCategory(category_name: string): Promise<ResponseType<any>> {
        const result = await query(
            `SELECT category_name FROM categories WHERE category_name ILIKE $1`,
            [category_name]
        );

        if (result.rowCount) {
            return {
                statusCode: HttpStatusCode.BAD_REQUEST,
                message: "Category này đã tồn tại!",
            };
        }

        await query(`INSERT INTO categories(category_name) VALUES ($1)`, [
            category_name,
        ]);

        return {
            statusCode: HttpStatusCode.OK,
            message: "Tạo category thành công",
        };
    }

    async getAllCategories(): Promise<ResponseType<CategoryType[]>> {
        const resutl = await query(`SELECT * FROM categories`);

        if (!resutl.rowCount) {
            return {
                statusCode: HttpStatusCode.NOT_FOUND,
                message: "Không có categories",
            };
        }

        return {
            statusCode: HttpStatusCode.OK,
            message: "Get categories successfull",
            data: resutl.rows as CategoryType[],
        };
    }

    async getCategoryById(
        category_id: string
    ): Promise<ResponseType<CategoryType>> {
        const result = await query(
            `SELECT * FROM categories WHERE category_id = $1`,
            [category_id]
        );

        if (!result.rowCount) {
            return {
                statusCode: HttpStatusCode.NOT_FOUND,
                message: "Không tìm thấy category có id = " + category_id,
            };
        }

        return {
            statusCode: HttpStatusCode.OK,
            message: "Get categories successfull",
            data: result.rows[0] as CategoryType,
        };
    }

    async updateCategoryById(
        category_id: string,
        category_name: string
    ): Promise<ResponseType<any>> {
        const result = await query(
            `UPDATE categories SET category_name = $1 WHERE category_id = $2`,
            [category_name, category_id]
        );

        if (!result.rowCount) {
            return {
                statusCode: HttpStatusCode.NOT_FOUND,
                message: "Không tìm thấy category có id = " + category_id,
            };
        }

        return {
            statusCode: HttpStatusCode.OK,
            message: "Update category successfull",
            data: result.rows[0] as CategoryType,
        };
    }

    async deleteCategoryById(category_id: string): Promise<ResponseType<any>> {
        const result = await query(
            `DELETE FROM categories WHERE category_id = $1`,
            [category_id]
        );

        if (!result.rowCount) {
            return {
                statusCode: HttpStatusCode.NOT_FOUND,
                message: "Không tìm thấy category có id = " + category_id,
            };
        }

        return {
            statusCode: HttpStatusCode.OK,
            message: "Delete category successfull",
        };
    }
}

export const categoryService: CategoryService = new CategoryService();
