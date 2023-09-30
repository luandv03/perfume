import {
    Stack,
    Text,
    Image,
    Group,
    Button,
    Center,
    Grid,
    Divider,
    Badge,
    ActionIcon,
    NumberInput,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { IconTrash } from "@tabler/icons-react";
import { useContext } from "react";

import { CartContext } from "../../providers/CartProvider/CartProvider";
import { ProductAvatar } from "../Product/ProductAvatar";

export interface CartItem {
    product_id: number;
    title: string;
    price: number;
    discount: number;
    quantity: number;
    brand: string;
    volume: number;
}

export function Cart() {
    const { cartUser, addCartItem, removeCartItem, updateCartItem } =
        useContext(CartContext);

    const handleRemoveCartItem = (item: CartItem) => {
        removeCartItem(item);
    };

    const handleDownItem = (product: CartItem, qty: number) => {
        const cartDown = {
            ...product,
            quantity: -1,
        };
        if (qty > 1) {
            addCartItem(cartDown);
        }
    };

    const handleUpItem = (product: CartItem, qty: number) => {
        const cartUp = {
            ...product,
            quantity: 1,
        };

        if (qty < 100) {
            addCartItem(cartUp);
        }
    };

    const handleUpdateCartItem = (product_id: number, quantity: number) => {
        if (quantity < 1 || quantity > 10) return;

        updateCartItem(product_id, quantity);
    };

    return (
        <Stack sx={{ border: "1px solid #f0e7e7", borderRadius: "4px" }} p={10}>
            <div
                style={{
                    width: "100%",
                    height: "60px",
                    borderBottom: "1px solid #f0e7e7",
                }}
            >
                <Group sx={{ height: "100%" }}>
                    <Text size="24px" fw={500}>
                        Giỏ Hàng
                    </Text>
                    <span style={{ fontSize: "18px", fontWeight: 500 }}>
                        (
                        {cartUser.reduce(
                            (acc: number, curr: CartItem) =>
                                acc + curr.quantity,
                            0
                        )}{" "}
                        sản phẩm)
                    </span>
                </Group>
            </div>

            {cartUser.length <= 0 ? (
                <>
                    <div>
                        <Image
                            src="http://bizweb.dktcdn.net/100/270/860/themes/606449/assets/empty-bags.jpg?1510132489127"
                            height={300}
                            alt="Norway"
                            fit="contain"
                        />
                    </div>
                    <Center>
                        <Link to="/">
                            <Button>Tiếp tục mua hàng</Button>
                        </Link>
                    </Center>
                </>
            ) : (
                <Grid gutter={20}>
                    <Grid.Col md={9} sm={12}>
                        <Grid>
                            {cartUser.map((item: CartItem) => (
                                <>
                                    <Grid.Col span={12} key={item.product_id}>
                                        <Group>
                                            <div
                                                style={{ position: "relative" }}
                                            >
                                                <ProductAvatar
                                                    data={item.product_id}
                                                />
                                                {item.discount > 0 && (
                                                    <Badge
                                                        color="pink"
                                                        variant="light"
                                                        sx={{
                                                            position:
                                                                "absolute",
                                                            top: "5px",
                                                            left: "5px",
                                                        }}
                                                    >
                                                        -{item.discount}%
                                                    </Badge>
                                                )}
                                            </div>

                                            <Group
                                                position="apart"
                                                sx={{ flex: "1" }}
                                            >
                                                <Group>
                                                    <Stack spacing={4}>
                                                        <Link
                                                            to={`/product/${item.product_id}/detail`}
                                                            style={{
                                                                textDecoration:
                                                                    "none",
                                                                color: "black",
                                                            }}
                                                        >
                                                            <Text
                                                                size="20px"
                                                                weight={500}
                                                                lineClamp={2}
                                                            >
                                                                {item.title}
                                                            </Text>
                                                        </Link>

                                                        <Group>
                                                            <Text
                                                                size="16px"
                                                                fw={500}
                                                            >
                                                                Giá:
                                                            </Text>
                                                            <Text
                                                                fw={500}
                                                                color="gray"
                                                            >
                                                                {new Intl.NumberFormat(
                                                                    "vi-VN",
                                                                    {
                                                                        style: "currency",
                                                                        currency:
                                                                            "VND",
                                                                        maximumFractionDigits: 9,
                                                                    }
                                                                ).format(
                                                                    item.price
                                                                )}
                                                            </Text>
                                                        </Group>

                                                        <Group>
                                                            <Text
                                                                size="16px"
                                                                fw={500}
                                                            >
                                                                Thương hiệu
                                                            </Text>
                                                            <div>
                                                                <Button
                                                                    radius={0}
                                                                    compact
                                                                    variant="default"
                                                                >
                                                                    {item.brand}
                                                                </Button>
                                                            </div>
                                                        </Group>

                                                        <Group>
                                                            <Text
                                                                size="16px"
                                                                fw={500}
                                                            >
                                                                Dung tích
                                                            </Text>
                                                            <div>
                                                                <Button
                                                                    radius={0}
                                                                    compact
                                                                    variant="default"
                                                                >
                                                                    {
                                                                        item.volume
                                                                    }
                                                                    ml
                                                                </Button>
                                                            </div>
                                                        </Group>
                                                    </Stack>
                                                </Group>
                                                <Group spacing={60}>
                                                    <ActionIcon
                                                        onClick={() =>
                                                            handleRemoveCartItem(
                                                                item
                                                            )
                                                        }
                                                    >
                                                        <IconTrash />
                                                    </ActionIcon>

                                                    {/* Tăng giảm số lượng sản phẩm */}
                                                    <Group spacing={0}>
                                                        <ActionIcon
                                                            size={36}
                                                            variant="default"
                                                            onClick={() =>
                                                                handleDownItem(
                                                                    item,
                                                                    item.quantity
                                                                )
                                                            }
                                                        >
                                                            –
                                                        </ActionIcon>

                                                        <NumberInput
                                                            hideControls
                                                            value={
                                                                item.quantity
                                                            }
                                                            max={10}
                                                            min={1}
                                                            styles={{
                                                                input: {
                                                                    width: "50px",
                                                                    textAlign:
                                                                        "center",
                                                                },
                                                            }}
                                                            onBlur={(e) =>
                                                                handleUpdateCartItem(
                                                                    item.product_id,
                                                                    Number(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                )
                                                            }
                                                        />

                                                        <ActionIcon
                                                            size={36}
                                                            variant="default"
                                                            onClick={() =>
                                                                handleUpItem(
                                                                    item,
                                                                    item.quantity
                                                                )
                                                            }
                                                        >
                                                            +
                                                        </ActionIcon>
                                                    </Group>
                                                </Group>
                                            </Group>
                                        </Group>
                                    </Grid.Col>
                                </>
                            ))}
                        </Grid>
                    </Grid.Col>

                    <Divider />
                    <Grid.Col md={3} sm={0}>
                        <Stack sx={{ width: "100%" }}>
                            <Group position="apart">
                                <Text size="16px" fw={500} color="gray">
                                    Đơn hàng:
                                </Text>
                                <Text size="18px" fw={500} color="gray">
                                    {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                        maximumFractionDigits: 9,
                                    }).format(
                                        cartUser.reduce(
                                            (acc: number, curr: CartItem) =>
                                                acc +
                                                curr.quantity * curr.price,
                                            0
                                        )
                                    )}
                                </Text>
                            </Group>

                            <Group position="apart">
                                <Text size="16px" fw={500} color="gray">
                                    Giảm:
                                </Text>
                                <Text size="14px" color="gray">
                                    -
                                    {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                        maximumFractionDigits: 9,
                                    }).format(
                                        cartUser.reduce(
                                            (acc: number, curr: CartItem) =>
                                                acc +
                                                curr.quantity *
                                                    curr.price *
                                                    (curr.discount / 100),
                                            0
                                        )
                                    )}
                                </Text>
                            </Group>

                            <Divider></Divider>

                            <Group position="apart">
                                <Text size="18px" fw={500}>
                                    Tạm Tính:
                                </Text>
                                <Text size="20px" fw={500}>
                                    {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                        maximumFractionDigits: 9,
                                    }).format(
                                        Math.ceil(
                                            cartUser.reduce(
                                                (acc: number, curr: CartItem) =>
                                                    acc +
                                                    curr.quantity *
                                                        curr.price *
                                                        (1 -
                                                            curr.discount /
                                                                100),
                                                0
                                            )
                                        )
                                    )}
                                </Text>
                            </Group>

                            <Button size="md" p={0}>
                                <Link to="/checkout" style={{ width: "100%" }}>
                                    <Text color="white">Mua ngay</Text>
                                </Link>
                            </Button>
                        </Stack>
                    </Grid.Col>
                </Grid>
            )}
        </Stack>
    );
}
