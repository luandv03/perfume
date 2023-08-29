import { Dispatch, SetStateAction } from "react";
import { Textarea, Container } from "@mantine/core";
import { useOutletContext } from "react-router-dom";

interface ProductType {
    product_id: number;
    category_id: number;
    title: string;
    description: string;
    brand: string;
    year_publish: number;
    volume: number;
    price: number;
    discount: number;
    quantity: number;
}

export function ProductDes() {
    const [product, setProduct]: [
        ProductType,
        Dispatch<SetStateAction<ProductType>>
    ] = useOutletContext();

    return (
        <Container
            style={{
                width: "800px",
            }}
        >
            <Textarea
                placeholder="Mô tả..."
                label="Mô tả"
                withAsterisk
                autosize
                minRows={4}
                maxRows={8}
                value={product.description}
                onChange={(e) =>
                    setProduct((prev) => {
                        return {
                            ...prev,
                            description: e.target.value,
                        };
                    })
                }
            />
        </Container>
    );
}
