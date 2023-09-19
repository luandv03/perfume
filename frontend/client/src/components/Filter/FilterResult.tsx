import {
    Stack,
    Divider,
    Text,
    Group,
    Radio,
    SimpleGrid,
    Pagination,
    Center,
    Alert,
    LoadingOverlay,
} from "@mantine/core";
import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import { Product } from "../Product/Product";
import { ProductConstant } from "../../types/products.type";
import { ProductType } from "../../types/products.type";
import { productService } from "../../services/product.service";

export function FilterResult({
    prices,
    filterBrand,
}: {
    prices: string[];
    filterBrand: string[];
}) {
    const [loading, setLoading] = useState<boolean>(false);
    const [products, setProducts] = useState<ProductType[]>([ProductConstant]);
    const [sort, setSort] = useState<string>("");
    const { category_id } = useParams();

    const [totalPage, setTotalPage] = useState(0);
    const [page, setPage] = useState(1);
    const { state } = useLocation();

    const handleGetProductByFilter = async () => {
        setLoading(true);
        const filterPrice: number[][] = [];

        prices.map((item: string) => {
            filterPrice.push(item.split(",").map((i) => Number(i)));
        });

        const res = await productService.getProductByFilter(
            Number(category_id),
            filterBrand,
            filterPrice,
            page,
            12
        );

        setLoading(false);

        setTotalPage(res.data.totalPage);
        setProducts(res.data.products);
    };

    const handleSortByPrice = () => {
        if (sort === "asc") {
            setProducts((prev) => {
                const list = prev.sort((a, b) => b.price - a.price);

                return list;
            });
        }

        if (sort === "desc") {
            setProducts((prev) => {
                const list = prev.sort((a, b) => a.price - b.price);

                return list;
            });
        }
    };

    useEffect(() => {
        handleSortByPrice();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sort, page]);

    useEffect(() => {
        handleGetProductByFilter();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, window.location.pathname, filterBrand, prices]);

    return (
        <Stack
            sx={{
                border: "1px solid #f0e7e7",
                borderRadius: "4px",
                width: "100%",
            }}
            spacing={10}
            p={10}
        >
            <Text size="24px" fw={500}>
                {state.category_name}
            </Text>
            <Group align="center" style={{ width: "100%" }}>
                <Text fw={500}>Xếp theo: </Text>
                <Radio.Group value={sort} onChange={setSort}>
                    <Group mt="xs">
                        <Radio value="asc" label="Giá từ thấp đến cao" />
                        <Radio value="desc" label="Giá từ cao xuống thấp" />
                    </Group>
                </Radio.Group>
            </Group>
            <Divider my="xs"></Divider>
            {products.length > 0 ? (
                <SimpleGrid cols={4} spacing={0}>
                    {products.map((item: ProductType) => (
                        <Product data={item} />
                    ))}
                </SimpleGrid>
            ) : (
                <Alert title="Tiếc quá!" color="red">
                    <Text fw={700}>
                        Không có sản phẩm nào trong danh mục này
                    </Text>
                </Alert>
            )}
            <LoadingOverlay
                sx={{ position: "fixed", height: "100%" }}
                loaderProps={{ size: "sm", color: "pink", variant: "oval" }}
                overlayOpacity={0.3}
                overlayColor="#c5c5c5"
                visible={loading}
            />

            <Center mt={50}>
                <Pagination value={page} onChange={setPage} total={totalPage} />
            </Center>
        </Stack>
    );
}
