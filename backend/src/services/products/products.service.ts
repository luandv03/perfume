import { query } from "../../db/index.db";
import { HttpStatusCode } from "../../configs/httpStatusCode.config";
import { ProductType } from "../../types/products/product.type";
import { ResponseType } from "../../types/response.type";

class ProductService {
    async getProductByCateId(
        category_id: number,
        offset: string,
        limit: string
    ): Promise<ResponseType<ProductType[]>> {
        const results = await query(
            `SELECT product_id, title, price, discount, volume, brand, year_publish, description 
            FROM products  JOIN categories USING(category_id)
            WHERE category_id = $1 
            OFFSET $2 LIMIT $3`,
            [category_id, offset, limit]
        );

        if (!results.rows.length) {
            return {
                statusCode: HttpStatusCode.OK,
                message: "Empty",
            };
        }

        return {
            statusCode: HttpStatusCode.OK,
            message: "Get Products Success",
            data: results.rows,
        };
    }

    async getAllBrand(): Promise<ResponseType<string[]>> {
        const results = await query(`SELECT distinct brand FROM products`);

        if (!results.rows.length) {
            return {
                statusCode: HttpStatusCode.NOT_FOUND,
                message: "Brand Not Found",
            };
        }

        return {
            statusCode: HttpStatusCode.OK,
            message: "Get All Brand Success",
            data: results.rows,
        };
    }

    async getProductPhotoById(
        product_id: number,
        offset: number,
        limit: number
    ): Promise<ResponseType<ProductType[]>> {
        const results = await query(
            `SELECT product_photo_id, product_photo_url FROM product_photos WHERE product_id = $1 OFFSET $2 LIMIT $3`,
            [product_id, offset, limit]
        );

        return {
            statusCode: HttpStatusCode.OK,
            message: "Get Product Photo Success",
            data: results.rows,
        };
    }

    async getProductById(
        product_id: number
    ): Promise<ResponseType<ProductType>> {
        const results = await query(
            `SELECT * FROM products WHERE product_id = $1`,
            [product_id]
        );

        if (!results.rows.length) {
            return {
                statusCode: HttpStatusCode.NOT_FOUND,
                message: "Product not found",
            };
        }

        return {
            statusCode: HttpStatusCode.OK,
            message: "Get Product Success",
            data: results.rows[0],
        };
    }

    async getProductByTitle(
        title: string,
        offset: string,
        limit: string
    ): Promise<ResponseType<ProductType[]>> {
        const results = await query(
            `SELECT product_id, title, price, volume, discount FROM products WHERE title ILIKE '%' || $1 || '%' OFFSET $2 LIMIT $3 `,
            [title, Number(offset), Number(limit)]
        );

        if (!results.rows.length) {
            return {
                statusCode: HttpStatusCode.NOT_FOUND,
                message: "Product not found",
            };
        }

        return {
            statusCode: HttpStatusCode.OK,
            message: "Get Product Success",
            data: results.rows,
        };
    }

    async getProductByNewTime(
        offset: string,
        limit: string
    ): Promise<ResponseType<ProductType[]>> {
        const results = await query(
            `SELECT product_id, title, price, discount 
            FROM products ORDER BY created_at DESC LIMIT $1 OFFSET $2 `,
            [limit, offset]
        );

        if (!results.rows.length) {
            return {
                statusCode: HttpStatusCode.NOT_FOUND,
                message: "Product not found",
            };
        }

        return {
            statusCode: HttpStatusCode.OK,
            message: "Get Product Success",
            data: results.rows,
        };
    }

    async getProductByFilter(
        brand: string[],
        price: number[],
        page: number
    ): Promise<ResponseType<ProductType[]>> {
        // dòng đầu tmp để lưu xâu định dạng: ["'a'", "'b'"]
        // vì khi vào cái rest dưới nếu để là ["a","b"] => se thanh (a,b) trong câu query
        const tmp = brand.map((item) => `'${item}'`);
        const brand_filter = brand.length <= 0 ? "" : `(${[...tmp]})`;

        const prices =
            price.length <= 0 ? [] : [Math.min(...price), Math.max(...price)];

        const price_filter = !prices.length
            ? ""
            : `BETWEEN ${prices[0]} AND ${price[1]}`;

        let paginate = `OFFSET ${9 * (page - 1)} FETCH FIRST 9 ROWS ONLY`;

        let query_filter: string = "";

        if (!brand_filter.length && !price_filter.length) {
            query_filter = `SELECT product_id, title, price, quantity, created_at FROM products`;
        } else if (!brand_filter.length) {
            query_filter = `SELECT product_id, title, price, quantity, created_at FROM products WHERE price ${price_filter}`;
        } else if (!price_filter.length) {
            query_filter = `SELECT product_id, title, price, quantity, created_at FROM products WHERE brand IN ${brand_filter}`;
        } else {
            query_filter = `SELECT product_id, title, price, quantity, created_at FROM products WHERE brand IN ${brand_filter} and price ${price_filter}`;
        }

        const results = await query(query_filter);

        if (!results.rows.length) {
            return {
                statusCode: HttpStatusCode.NOT_FOUND,
                message: "Not results",
            };
        }

        return {
            statusCode: HttpStatusCode.OK,
            message: "Get products success",
            data: results.rows,
        };
    }
}

export const productService: ProductService = new ProductService();
