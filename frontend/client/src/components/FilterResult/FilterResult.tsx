import {
    Stack,
    Divider,
    Text,
    Group,
    Radio,
    SimpleGrid,
    Pagination,
    Center,
} from "@mantine/core";
import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import { Product } from "../Product/Product";
import { ProductConstant } from "../../types/products.type";
import { ProductType } from "../../types/products.type";
import { productService } from "../../services/product.service";

export function FilterResult() {
    const [products, setProducts] = useState<ProductType[]>([ProductConstant]);
    const { category_id } = useParams();

    const [totalPage, setTotalPage] = useState(0);
    const [page, setPage] = useState(1);
    const { state } = useLocation();

    const handleGetProduct = async () => {
        const res = await productService.getProductByCateId(
            Number(category_id),
            page,
            12
        );

        setTotalPage(res.data.totalPage);
        setProducts(res.data.products);
    };

    useEffect(() => {
        handleGetProduct();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, window.location.pathname]);

    return (
        <Stack
            sx={{ border: "1px solid #f0e7e7", borderRadius: "4px" }}
            spacing={10}
            p={10}
        >
            <Text size="24px" fw={500}>
                {state.category_name}
            </Text>
            <Group align="center">
                <Text fw={500}>Xếp theo: </Text>
                <Radio.Group>
                    <Group mt="xs">
                        <Radio value="react" label="Hàng mới" />
                        <Radio value="ng" label="Giá từ thấp đến cao" />
                        <Radio value="svelte" label="Giá từ cao xuống thấp" />
                    </Group>
                </Radio.Group>
            </Group>
            <Divider my="xs"></Divider>
            <SimpleGrid cols={4} spacing={0}>
                {products.length > 0 &&
                    products.map((item: ProductType) => (
                        <Product data={item} />
                    ))}
            </SimpleGrid>
            <Center mt={50}>
                <Pagination value={page} onChange={setPage} total={totalPage} />
            </Center>
        </Stack>
    );
}
