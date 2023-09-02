import { Request, Response } from "express";
import { productService } from "../../services/products/products.service";
import { HttpStatusCode } from "../../configs/httpStatusCode.config";

export class ProductController {
    async listProducts(req: Request, res: Response): Promise<any> {
        try {
            const { page, limit } = req.query;
            const data = await productService.listProducts(
                Number(page),
                Number(limit)
            );

            return res.status(data.statusCode).json(data);
        } catch (error) {
            return res.status(500).json({
                statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
                message: "Server Error",
                error: error,
            });
        }
    }

    async getProductByCateId(req: Request, res: Response): Promise<any> {
        try {
            const category_id = req.params.category_id;
            const { offset, limit } = req.query;
            const data = await productService.getProductByCateId(
                Number(category_id),
                offset as string,
                limit as string
            );

            return res.status(data.statusCode).json(data);
        } catch (error) {
            return res.status(500).json({
                statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
                message: "Server Error",
            });
        }
    }

    async getAllBrand(req: Request, res: Response): Promise<any> {
        try {
            const data = await productService.getAllBrand();

            return res.status(data.statusCode).json(data);
        } catch (error) {
            return res.status(500).json({
                statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
                message: "Server Error",
            });
        }
    }

    async getProductPhotoById(req: Request, res: Response): Promise<any> {
        try {
            const product_id = req.params.product_id;
            const data = await productService.getProductPhotoById(
                Number(product_id)
            );

            return res.status(data.statusCode).json(data);
        } catch (error) {
            return res.status(500).json({
                statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
                message: "Server Error",
            });
        }
    }

    async getProductById(req: Request, res: Response): Promise<any> {
        try {
            const { product_id } = req.params;
            const data = await productService.getProductById(
                Number(product_id)
            );

            return res.status(data.statusCode).json(data);
        } catch (error) {
            return res.status(500).json({
                statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
                message: "Server Error",
            });
        }
    }

    async getProductByTitle(req: Request, res: Response): Promise<any> {
        try {
            const { title, page, limit } = req.query;
            const data = await productService.getProductByTitle(
                title as string,
                Number(page),
                Number(limit)
            );

            return res.status(data.statusCode).json(data);
        } catch (error) {
            return res.status(500).json({
                statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
                message: "Server Error",
                error,
            });
        }
    }

    async getProductByNewTime(req: Request, res: Response): Promise<any> {
        try {
            const { offset, limit } = req.query;
            const data = await productService.getProductByNewTime(
                offset as string,
                limit as string
            );

            return res.status(data.statusCode).json(data);
        } catch (error) {
            return res.status(500).json({
                statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
                message: "Server Error",
            });
        }
    }

    async getProductByFilter(req: Request, res: Response): Promise<any> {
        try {
            const { brand, price, page } = req.query;

            const data = await productService.getProductByFilter(
                JSON.parse(brand as string) as string[],
                JSON.parse(price as string) as number[],
                JSON.parse(page as string) as number
            );

            return res.status(data.statusCode).json(data);
        } catch (error) {
            return res.status(500).json({
                statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
                message: "Server Error",
                error,
            });
        }
    }

    async createProduct(req: Request, res: Response): Promise<any> {
        try {
            const { product, photos } = req.body;

            const data = await productService.createProduct(product, photos);

            return res.status(data.statusCode).json(data);
        } catch (error) {
            return res.status(500).json({
                statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
                message: "Server Error",
                error,
            });
        }
    }

    async updateProductById(req: Request, res: Response): Promise<any> {
        try {
            const product = req.body;

            const data = await productService.updateProductById(product);

            return res.status(data.statusCode).json(data);
        } catch (error) {
            return res.status(500).json({
                statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
                message: "Server Error",
                error,
            });
        }
    }
}
