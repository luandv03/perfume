import {
    Card,
    // Image,
    Group,
    Text,
    createStyles,
    Button,
    Badge,
    Stack,
} from "@mantine/core";
import { IconShoppingCartPlus, IconEye } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { notifications } from "@mantine/notifications";

import { CartContext } from "../../providers/CartProvider/CartProvider";
import { ProductType } from "../../types/products.type";
import { ProductAvatar } from "./ProductAvatar";

const useStyles = createStyles(() => ({
    hover: {
        "&:hover": {
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;",
            cursor: "pointer",
        },
    },
}));
export function Product({ data }: { data: ProductType }) {
    const { addCartItem } = useContext(CartContext);

    const handleAddToCart = () => {
        const { product_id, title, price, discount, brand, volume } = data;
        const cartItem = {
            product_id,
            title,
            price,
            discount,
            brand,
            volume,
            quantity: 1,
        };
        addCartItem(cartItem);
        notifications.show({
            title: "Thành công",
            message: "Bạn đã thêm thành công sản phẩm :>",
        });
    };

    const { classes } = useStyles();
    return (
        <Card
            shadow="sm"
            padding="lg"
            radius="md"
            className={classes.hover}
            style={{ borderRadius: 0 }}
            key={data.product_id}
        >
            <Card.Section>
                {data.product_id !== 0 && (
                    <ProductAvatar data={data.product_id} />
                )}
            </Card.Section>

            <Stack spacing={0}>
                <Link
                    to={`/product/${data.product_id}/detail`}
                    state={{ product: data }}
                >
                    <Text
                        size="16px"
                        weight={500}
                        lineClamp={2}
                        color="black"
                        sx={{ lineHeight: "16px", height: "32px" }}
                    >
                        {data.title}
                    </Text>
                </Link>

                <Group>
                    <Text>
                        {data.brand} / {data.volume}ml
                    </Text>
                </Group>

                <Group>
                    <Text fw={500}>
                        {" "}
                        {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                            maximumFractionDigits: 9,
                        }).format(data.price)}
                    </Text>
                </Group>

                <Badge
                    color="pink"
                    variant="light"
                    sx={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                    }}
                >
                    -{data.discount}%
                </Badge>
            </Stack>

            <Group spacing={4} sx={{ marginTop: "auto" }}>
                <Button size="16px" onClick={() => handleAddToCart()}>
                    <IconShoppingCartPlus />
                </Button>

                <Button size="16px">
                    <Link
                        to={`/product/${data.product_id}/detail`}
                        state={{ product: data }}
                        style={{ color: "white" }}
                    >
                        <IconEye />
                    </Link>
                </Button>
            </Group>
        </Card>
    );
}
