import { Request, Response } from "express";
import { validate } from "class-validator";

import { categoryService } from "../../services/categories/categories.service";
import { ResponseType } from "../../types/response.type";
import { HttpStatusCode } from "../../configs/httpStatusCode.config";
import { CategoryDto } from "../../dtos/categories/categories.dto";
import { handleErrorDto } from "../../utils/handle_error_dto.util";
import { CategoryType } from "../../types/categories/category.type";

export class CategoryControler {
    async createCategory(req: Request, res: Response) {
        try {
            const { category_name } = req.body;

            const errorResult = await handleErrorDto<{ category_name: string }>(
                { category_name },
                new CategoryDto()
            );

            if (errorResult.statusCode) {
                return res.status(errorResult.statusCode).json(errorResult);
            }

            const data: ResponseType<any> =
                await categoryService.createCategory(category_name);

            return res.status(data.statusCode).json(data);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
                message: error,
            });
        }
    }

    async getAllCategories(req: Request, res: Response): Promise<any> {
        try {
            const data: ResponseType<CategoryType[]> =
                await categoryService.getAllCategories();

            return res.status(data.statusCode).json(data);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
                message: error,
            });
        }
    }

    async getCategoryById(req: Request, res: Response): Promise<any> {
        try {
            const category_id = req.params.category_id;

            const data: ResponseType<CategoryType> =
                await categoryService.getCategoryById(category_id);

            return res.status(data.statusCode).json(data);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
                message: error,
            });
        }
    }

    async updateCategoryById(req: Request, res: Response): Promise<any> {
        try {
            const category_id = req.params.category_id;
            const category_name = req.body.category_name;

            const data: ResponseType<CategoryType> =
                await categoryService.updateCategoryById(
                    category_id,
                    category_name
                );

            return res.status(data.statusCode).json(data);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
                message: error,
            });
        }
    }

    async deleteCategoryById(req: Request, res: Response): Promise<any> {
        try {
            const category_id = req.params.category_id;

            const data: ResponseType<CategoryType> =
                await categoryService.deleteCategoryById(category_id);

            return res.status(data.statusCode).json(data);
        } catch (error) {
            return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
                statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
                message: error,
            });
        }
    }
}
