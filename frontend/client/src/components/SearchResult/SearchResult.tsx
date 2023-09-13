import {
    SimpleGrid,
    Center,
    Text,
    Stack,
    Card,
    createStyles,
    Group,
    Button,
    Badge,
    Pagination,
} from "@mantine/core";

import { useEffect, useState, useContext } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { IconShoppingCartPlus, IconEye } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

import { ProductAvatar } from "../Product/ProductAvatar";
import { ProductType, ProductConstant } from "../../types/products.type";
import { productService } from "../../services/product.service";
import { CartContext } from "../../providers/CartProvider/CartProvider";

const useStyles = createStyles(() => ({
    hover: {
        "&:hover": {
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;",
            cursor: "pointer",
        },
    },
}));

export function SearchResult() {
    const { classes } = useStyles();
    const { addToCart } = useContext(CartContext);

    const [products, setProducts] = useState<ProductType[]>([ProductConstant]);
    const [totalProduct, setTotalProduct] = useState<number>(0);
    const [searchParams] = useSearchParams();

    const [totalPage, setTotalPage] = useState(0);
    const [page, setPage] = useState(1);
    // const [total, setTotal] = useState<string>("10");

    const handleGetProductBySearch = async () => {
        const resData = await productService.getProductBySearchTitle(
            searchParams.get("title") as string,
            page,
            12
        );

        setTotalProduct(resData.data.totalProducts);
        setTotalPage(resData.data.totalPage);
        setProducts(resData.data.products);
    };

    const handleAddToCart = (product: ProductType) => {
        const { product_id, title, price, discount, brand, volume } = product;
        const cartItem = {
            product_id,
            title,
            price,
            discount,
            brand,
            volume,
            number_add_item: 1,
        };
        addToCart(cartItem);
        notifications.show({
            title: "Thành công",
            message: "Bạn đã thêm thành công sản phẩm :>",
        });
    };

    useEffect(() => {
        handleGetProductBySearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, searchParams]);

    return (
        <Stack spacing={10}>
            <Center>
                <Text size={20} fw={500}>
                    Có {totalProduct} sản phẩm phù hợp
                </Text>
            </Center>
            <SimpleGrid cols={4} sx={{ width: "100%" }}>
                {products.length > 0 &&
                    products.map((product: ProductType) => (
                        <Card
                            shadow="sm"
                            padding="lg"
                            radius="md"
                            withBorder
                            className={classes.hover}
                            key={product.product_id}
                        >
                            <Card.Section>
                                {product.product_id !== 0 && (
                                    <ProductAvatar data={product.product_id} />
                                )}
                            </Card.Section>

                            <Group position="apart" mt="md" mb="xs">
                                <Link
                                    to={`/product/${product.product_id}/detail`}
                                    state={{ product: product }}
                                >
                                    <Text
                                        weight={500}
                                        lineClamp={2}
                                        color="black"
                                    >
                                        {product.title}
                                    </Text>
                                </Link>
                            </Group>

                            <Text>
                                {product.brand} / {product.volume}ml
                            </Text>

                            <Group>
                                <Text fw={500}>
                                    {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                        maximumFractionDigits: 9,
                                    }).format(
                                        product.price *
                                            (1 - product.discount / 100)
                                    )}
                                </Text>
                                <Text td="line-through">
                                    {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                        maximumFractionDigits: 9,
                                    }).format(product.price)}
                                </Text>
                            </Group>

                            <Group spacing={4}>
                                <Button
                                    size="16px"
                                    onClick={() => handleAddToCart(product)}
                                >
                                    <IconShoppingCartPlus />
                                </Button>

                                <Button size="16px">
                                    <Link
                                        to={`/product/${product.product_id}/detail`}
                                        state={{ product: product }}
                                        style={{ color: "white" }}
                                    >
                                        <IconEye />
                                    </Link>
                                </Button>
                            </Group>
                            {product.discount > 0 && (
                                <Badge
                                    color="pink"
                                    variant="light"
                                    sx={{
                                        position: "absolute",
                                        top: "10px",
                                        left: "10px",
                                    }}
                                >
                                    -{product.discount}%
                                </Badge>
                            )}
                        </Card>
                    ))}
            </SimpleGrid>
            <Center mt={50}>
                <Pagination value={page} onChange={setPage} total={totalPage} />
            </Center>
        </Stack>
    );
}
