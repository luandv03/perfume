import {
    Card,
    Image,
    Group,
    Text,
    createStyles,
    Button,
    Badge,
} from "@mantine/core";
import { IconShoppingCartPlus, IconEye } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { notifications } from "@mantine/notifications";

import { CartContext } from "../../providers/CartProvider/CartProvider";
import { ProductType } from "../../types/products.type";

const useStyles = createStyles(() => ({
    hover: {
        "&:hover": {
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;",
            cursor: "pointer",
        },
    },
}));
// { item }: { item: { image: string; title: string } }
export function Product() {
    const { addToCart } = useContext(CartContext);

    // const handleAddToCart = (product: ProductType) => {
    //     const { product_id, title, price, discount, brand, volume } = product;
    //     const cartItem = {
    //         product_id,
    //         title,
    //         price,
    //         discount,
    //         brand,
    //         volume,
    //         number_add_item: 1,
    //     };
    //     addToCart(cartItem);
    //     notifications.show({
    //         title: "Thành công",
    //         message: "Bạn đã thêm thành công sản phẩm :>",
    //     });
    // };

    const { classes } = useStyles();
    return (
        <Card
            shadow="sm"
            padding="lg"
            radius="md"
            className={classes.hover}
            style={{ borderRadius: 0 }}
        >
            <Card.Section>
                <Image
                    src="https://charmecosmetic.vn/wp-content/uploads/2022/10/charme-no-1-peace-1.jpg"
                    height={100}
                    alt="Norway"
                    fit="contain"
                />
            </Card.Section>

            <Group position="apart" mt="md" mb="xs">
                <Link to="/product/2/detail">
                    <Text size="16px" weight={500} lineClamp={2} color="black">
                        Creed Avetus For Men EDP
                    </Text>
                </Link>

                <Group>
                    <Text>Gucci / 100ml</Text>
                </Group>

                <Group>
                    <Text fw={500}>2.000.000 đ</Text>
                    <Text td="line-through">3.000.000 đ</Text>
                </Group>

                <Group spacing={4}>
                    <Button
                        size="16px"
                        // onClick={() => handleAddToCart()}
                    >
                        <IconShoppingCartPlus />
                    </Button>

                    <Button size="16px">
                        <Link to="/product/1/detail" style={{ color: "white" }}>
                            <IconEye />
                        </Link>
                    </Button>
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
                    -10%
                </Badge>
            </Group>
        </Card>
    );
}
