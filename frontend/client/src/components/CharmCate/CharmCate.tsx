import {
    Stack,
    Text,
    SimpleGrid,
    Card,
    Group,
    Button,
    Badge,
    Center,
    createStyles,
    Divider,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";

import { IconShoppingCartPlus, IconEye } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";

import { ProductAvatar } from "../Product/ProductAvatar";
import { CartContext } from "../../providers/CartProvider/CartProvider";
import { productService } from "../../services/product.service";
import { ProductType, ProductConstant } from "../../types/products.type";
import { CategoryType } from "../../types/category.type";

const useStyles = createStyles(() => ({
    hover: {
        "&:hover": {
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;",
            cursor: "pointer",
        },
    },
}));

export function CharmCate({ category }: { category: CategoryType }) {
    const { classes } = useStyles();
    const { addToCart } = useContext(CartContext);

    const [products, setProducts] = useState<ProductType[]>([ProductConstant]);

    const handleGetProductByCateId = async () => {
        const resProduct = await productService.getProductByCateId(
            category.category_id,
            1,
            8
        );
        setProducts(resProduct.data.products);
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
        handleGetProductByCateId();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Stack sx={{ width: "100%" }}>
            <Text size="20px" fw={500} key={category.category_id}>
                {category.category_name}
            </Text>

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
            <Center>
                <Link
                    to={`/product/${category.category_id}/filter`}
                    state={{ category_name: category.category_name }}
                >
                    <Text color="gray">Xem tất cả</Text>
                </Link>
            </Center>

            <Divider></Divider>
        </Stack>
    );
}
