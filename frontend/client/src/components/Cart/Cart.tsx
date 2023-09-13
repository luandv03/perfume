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
    NumberInputHandlers,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { IconTrash } from "@tabler/icons-react";
import { useState, useRef, useContext } from "react";

import { CartContext } from "../../providers/CartProvider/CartProvider";
import { ProductAvatar } from "../Product/ProductAvatar";

interface CartItem {
    product_id: number;
    title: string;
    price: number;
    discount: number;
    quantity: number;
    brand: string;
    volume: number;
}

export function Cart() {
    const [value, setValue] = useState<number | "">(0);
    const handlers = useRef<NumberInputHandlers>();

    const { cart, removeItem, upQuantityItem, downQuantityItem } =
        useContext(CartContext);

    const handleRemoveCartItem = (product_id: number) => {
        removeItem(product_id);
    };

    const handleDownItem = (qty: number, product_id: number) => {
        if (qty > 1) {
            downQuantityItem(product_id);
        }
    };

    const handleUpItem = (qty: number, product_id: number) => {
        if (qty < 100) {
            upQuantityItem(product_id);
        }
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
                        ({cart.reduce((acc, curr) => acc + curr.quantity, 0)}{" "}
                        sản phẩm)
                    </span>
                </Group>
            </div>

            {cart.length <= 0 ? (
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
                    <Grid.Col span={9}>
                        <Grid>
                            {cart.map((item: CartItem) => (
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
                                                    <Stack>
                                                        <Text
                                                            size="20px"
                                                            weight={500}
                                                            lineClamp={2}
                                                        >
                                                            {item.title}
                                                        </Text>

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
                                                                item.product_id
                                                            )
                                                        }
                                                    >
                                                        <IconTrash />
                                                    </ActionIcon>

                                                    {/* Tăng giảm số lượng sản phẩm */}
                                                    <Group spacing={0}>
                                                        <Text size={18}>
                                                            Số lượng:
                                                        </Text>
                                                        <ActionIcon
                                                            size={36}
                                                            variant="default"
                                                            onClick={() =>
                                                                handleDownItem(
                                                                    item.quantity,
                                                                    item.product_id
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
                                                            disabled
                                                            max={10}
                                                            min={1}
                                                            styles={{
                                                                input: {
                                                                    width: "50px",
                                                                    textAlign:
                                                                        "center",
                                                                },
                                                            }}
                                                        />

                                                        <ActionIcon
                                                            size={36}
                                                            variant="default"
                                                            onClick={() =>
                                                                handleUpItem(
                                                                    item.quantity,
                                                                    item.product_id
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
                                    <Divider></Divider>
                                </>
                            ))}
                        </Grid>
                    </Grid.Col>

                    <Grid.Col span={3}>
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
                                        cart.reduce(
                                            (acc, curr) =>
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
                                        cart.reduce(
                                            (acc, curr) =>
                                                acc +
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
                                        cart.reduce(
                                            (acc, curr) =>
                                                acc +
                                                curr.quantity *
                                                    curr.price *
                                                    (1 - curr.discount / 100),
                                            0
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
