import { BaseService } from "./base.service";
import { ProductType, PhotoType } from "../types/product/product.type";

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

    async getProductById(product_id: number) {
        try {
            const res = await this.httpClientPublic.get(
                `/product/${product_id}/view`
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }

    async getPhotoProductById(product_id: number) {
        try {
            const res = await this.httpClientPublic.get(
                `/product/${product_id}/product_photo/view`
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }

    async createProduct(product: ProductType, photos: PhotoType[]) {
        try {
            const res = await this.httpClientPublic.post(`/product/create`, {
                product,
                photos,
            });

            return res.data;
        } catch (error) {
            return error;
        }
    }

    async updateProductById(product: ProductType) {
        try {
            const res = await this.httpClientPrivate.patch(
                `/product/update`,
                product
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }

    async uploadImage(formData: FormData) {
        try {
            const res = await this.httpClientPublic.post(
                `/image/upload/multi`,
                formData
            );

            return res.data;
        } catch (error) {
            return error;
        }
    }

    async deletePhotoById(public_id: string) {
        try {
            const res = await this.httpClientPublic.post(`/image/destroy`, {
                public_id,
            });

            return res.data;
        } catch (error) {
            return error;
        }
    }
}

export const productService: ProductService = new ProductService();
