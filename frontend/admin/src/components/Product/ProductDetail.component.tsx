import { Flex, TextInput, Select, NumberInput, Stack } from "@mantine/core";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useOutletContext } from "react-router-dom";

import { categoryService } from "../../services/category.service";

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

export function ProductDetail() {
    const [listCategorySelect, setListCategorySelect] = useState([
        {
            value: "0",
            label: "",
        },
    ]);

    const [product, setProduct]: [
        ProductType,
        Dispatch<SetStateAction<ProductType>>
    ] = useOutletContext();

    const handleGetCategories = async () => {
        const data = await categoryService.getAllCategories();

        const cateList = data.data.map(
            (item: { category_id: string; category_name: string }) => {
                return {
                    value: String(item.category_id),
                    label: item.category_name,
                };
            }
        );

        setListCategorySelect(cateList);
    };

    useEffect(() => {
        handleGetCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Stack>
            <Flex
                style={{
                    width: "100%",
                }}
                wrap="wrap"
                direction="row"
                gap="xs"
            >
                <TextInput
                    placeholder="Your name"
                    label="Product Name"
                    withAsterisk
                    miw={400}
                    value={product.title}
                    onChange={(e) =>
                        setProduct((prev) => {
                            return {
                                ...prev,
                                title: e.target.value,
                            };
                        })
                    }
                />
                <TextInput
                    placeholder="Your name"
                    label="Brand"
                    withAsterisk
                    miw={300}
                    value={product.brand}
                    onChange={(e) =>
                        setProduct((prev) => {
                            return {
                                ...prev,
                                brand: e.target.value,
                            };
                        })
                    }
                />
                <Select
                    label="Category"
                    placeholder="Pick one"
                    data={listCategorySelect}
                    value={String(product.category_id)}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onChange={(value: any) =>
                        setProduct((prev) => {
                            return {
                                ...prev,
                                category_id: Number(value),
                            };
                        })
                    }
                />
                <NumberInput
                    defaultValue={product.year_publish}
                    value={product.year_publish}
                    onChange={(value) =>
                        setProduct((prev) => {
                            return {
                                ...prev,
                                year_publish: value,
                            };
                        })
                    }
                    placeholder="Year Publish"
                    label="Year Publish"
                    withAsterisk
                />

                <NumberInput
                    value={product.volume}
                    onChange={(value) =>
                        setProduct((prev) => {
                            return {
                                ...prev,
                                volume: value,
                            };
                        })
                    }
                    placeholder="Volumn"
                    label="Volumn(ml)"
                    withAsterisk
                />

                <NumberInput
                    value={Number(product.price)}
                    onChange={(value) =>
                        setProduct((prev) => {
                            return {
                                ...prev,
                                price: String(value),
                            };
                        })
                    }
                    placeholder="Price(vnđ)"
                    label="Price"
                    withAsterisk
                />
                <NumberInput
                    value={Number(product.discount)}
                    onChange={(value) =>
                        setProduct((prev) => {
                            return {
                                ...prev,
                                discount: String(value),
                            };
                        })
                    }
                    placeholder="Discount(%)"
                    label="Discount"
                    withAsterisk
                />
                <NumberInput
                    value={product.quantity}
                    onChange={(value) =>
                        setProduct((prev) => {
                            return {
                                ...prev,
                                quantity: value,
                            };
                        })
                    }
                    placeholder="Quantity"
                    label="Quantity"
                    withAsterisk
                />
            </Flex>
        </Stack>
    );
}
