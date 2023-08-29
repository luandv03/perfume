import { query } from "../../db/index.db";
import { HttpStatusCode } from "../../configs/httpStatusCode.config";
import { ProductType } from "../../types/products/product.type";
import { ResponseType } from "../../types/response.type";

class ProductService {
    // list in admin page
    async listProducts(
        page: number,
        limit: number
    ): Promise<ResponseType<any>> {
        //limit = 10, page 1: => offset = 0,
        // page 2: offset = (page-1)*limit
        const totalProducts = await this.countProducts();
        const offset = (page - 1) * limit;
        const results = await query(
            `SELECT product_id, category_name, title, description , brand, year_publish, 
            volume, price, discount, quantity, created_at
            FROM products JOIN categories using(category_id) OFFSET $1 LIMIT $2`,
            [offset, limit]
        );

        return {
            statusCode: HttpStatusCode.OK,
            message: "Get products successfully",
            data: {
                products: results.rows,
                page: page,
                total: limit,
                totalPage: Math.ceil(totalProducts / limit),
                totalProducts,
            },
        };
    }

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
        product_id: number
    ): Promise<ResponseType<ProductType[]>> {
        const results = await query(
            `SELECT product_photo_id, product_photo_url FROM product_photos 
            WHERE product_id = $1 `,
            [product_id]
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
        page: number,
        limit: number
    ): Promise<ResponseType<any>> {
        //limit = 10, page 1: => offset = 0,
        // page 2: offset = (page-1)*limit
        const totalProducts = await query(
            `SELECT count(product_id) number_of_products
            FROM products WHERE title ILIKE '%' || $1 || '%'`,
            [title]
        );

        const offset = (page - 1) * limit;
        const results = await query(
            `SELECT product_id, category_name, title, description , brand, year_publish, 
            volume, price, discount, quantity, created_at
            FROM products JOIN categories using(category_id) 
            WHERE title ILIKE '%' || $1 || '%' OFFSET $2 LIMIT $3 `,
            [title, offset, limit]
        );

        return {
            statusCode: HttpStatusCode.OK,
            message: "Get Product Success",
            data: {
                products: results.rows,
                page: page,
                total: limit,
                totalPage: Math.ceil(
                    totalProducts.rows[0].number_of_products / limit
                ),
                totalProducts: Number(totalProducts.rows[0].number_of_products),
            },
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

    //update product by id
    async updateProductById(product: any): Promise<ResponseType<any>> {
        const {
            product_id,
            title,
            description,
            category_id,
            volume,
            price,
            quantity,
            year_publish,
            brand,
            discount,
        } = product;

        const results = await query(
            `UPDATE products SET title = $1, category_id = $2, 
            brand = $3, year_publish = $4, volume = $5, price = $6, discount = $7, quantity = $8,
            description = $9, updated_at = current_timestamp
            WHERE product_id = $10  RETURNING *
        `,
            [
                title,
                category_id,
                brand,
                year_publish,
                volume,
                Number(price),
                Number(discount),
                quantity,
                description,
                product_id,
            ]
        );

        return {
            statusCode: HttpStatusCode.OK,
            message: "Update successfull",
            data: results.rows[0],
        };
    }

    // count products in store
    async countProducts(): Promise<number> {
        const results = await query(
            `SELECT count(product_id) number_of_products FROM products`
        );

        return Number(results.rows[0].number_of_products);
    }
}

export const productService: ProductService = new ProductService();
