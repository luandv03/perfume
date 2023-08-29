import { BaseService } from "./base.service";

class ProductService extends BaseService {
    async listProducts(offset: number, limit: number) {
        try {
            const res = await this.httpClientPublic.get(
                `/product/view?page=${offset}&limit=${limit}`
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }

    async getProductByTitle(title: string, page: number, limit: number) {
        try {
            const res = await this.httpClientPublic.get(
                `/product/search?title=${title}&page=${page}&limit=${limit}`
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }
}

export const productService: ProductService = new ProductService();
