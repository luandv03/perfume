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
}

export interface PhotoType {
    public_id: string;
    secure_url: string;
}
