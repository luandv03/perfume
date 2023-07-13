export type ProductType = {
    product_id: number;
    title: string;
    price: number;
    discount: number;
    brand: string;
    volume: number;
    product_avatar?: string;
    year_published?: number;
};

export type ProductPhoto = {
    product_photo_id: number;
    product_photo_url: string;
};

export const ProductConstant: ProductType = {
    product_id: 0,
    title: "",
    price: 0,
    discount: 0,
    brand: "",
    volume: 0,
    product_avatar: "",
    year_published: 0,
};
