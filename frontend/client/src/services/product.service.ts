import { BaseService } from "./base.service";

class ProductService extends BaseService {
    async getProductByCateId(category_id: number, page: number, limit: number) {
        try {
            const res = await this.httpClientPublic.get(
                `/product/category/${category_id}/view?page=${page}&limit=${limit}`
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }

    async getAllBrand() {
        try {
            const res = await this.httpClientPublic.get(`/brand/view`);

            return res.data;
        } catch (error) {
            return error;
        }
    }

    async getPhotoProductById(
        product_id: number,
        offset: number,
        limit: number
    ) {
        try {
            const res = await this.httpClientPublic.get(
                `product/${product_id}/product_photo/view?offset=${offset}&limit=${limit}`
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }

    async getProductBySearchTitle(title: string, page: number, limit: number) {
        try {
            const res = await this.httpClientPublic.get(
                `product/search?title=${title}&page=${page}&limit=${limit}`
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }

    // /product/view/filter?category_id=5&brand=["Dior"]&price=[[0, 5000000], [5000000,0]]&page=1&limit=10
    async getProductByFilter(
        category_id: number,
        brand: string[],
        price: number[][],
        page: number,
        limit: number
    ) {
        try {
            const res = await this.httpClientPublic.post(
                `/product/view/filter?category_id=${category_id}&page=${page}&limit=${limit}`,
                {
                    brand,
                    price,
                }
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }
}

export const productService: ProductService = new ProductService();
