import { Image } from "@mantine/core";
import { useState, useEffect } from "react";

import { productService } from "../../services/product.service";
import { ProductPhoto } from "../../types/products.type";

export function ProductAvatar({ data }: { data: number }) {
    const [productAvatar, setProductAvatar] = useState<ProductPhoto>({
        product_photo_id: 0,
        product_photo_url: "",
    });

    const handleGetProductAvatar = async () => {
        const resPhoto = await productService.getPhotoProductById(data, 0, 1);

        setProductAvatar(resPhoto.data[0]);
    };

    useEffect(() => {
        handleGetProductAvatar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {productAvatar?.product_photo_id && (
                <Image
                    src={productAvatar.product_photo_url}
                    height={160}
                    alt="Norway"
                    fit="contain"
                    key={productAvatar.product_photo_id}
                />
            )}
        </>
    );
}
