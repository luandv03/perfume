export interface ProductType {
    product_id?: number;
    title: string;
    description: string;
    brand: string;
    volume: number;
    price: number;
    discount: number;
    quantity: number;
    category_id: number;
    year_publish: number;
    created_at?: string;
    updated_at?: string;
}
