import { Stack, Text, Divider, Group, TextInput, Button } from "@mantine/core";
import { Link } from "react-router-dom";
import { IconChevronLeft } from "@tabler/icons-react";
import { useContext } from "react";
import { CartContext } from "../../providers/CartProvider/CartProvider";

export function Checkout() {
    const { cart } = useContext(CartContext);

    return (
        <Stack w={700} spacing={6}>
            <Text size={24} fw={500}>
                Đơn hàng
            </Text>
            <Divider></Divider>
            {cart.length > 0 &&
                cart.map((item) => (
                    <Group spacing={30} position="apart" key={item.product_id}>
                        <Stack spacing={0}>
                            <Text size={20} fw={500}>
                                {item.title}
                            </Text>
                            <Group>
                                <Text color="gray">
                                    {item.brand} / {item.volume}ml
                                </Text>
                            </Group>
                        </Stack>
                        <Text size={20} color="gray">
                            x{item.quantity}
                        </Text>
                        <Stack spacing={0}>
                            <Text size={20} color="gray">
                                {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                    maximumFractionDigits: 9,
                                }).format(
                                    item.price * (1 - item.discount / 100)
                                )}
                            </Text>
                            <Text td="line-through" color="gray">
                                {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                    maximumFractionDigits: 9,
                                }).format(item.price * (item.discount / 100))}
                            </Text>
                        </Stack>
                    </Group>
                ))}
            <Divider my="lg" variant="dashed"></Divider>
            <Group position="apart">
                <Text size={20} fw={500}>
                    Đơn hàng
                </Text>
                <Text size={20}>
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
                                    (1 - curr.discount * 0.01),
                            0
                        )
                    )}
                </Text>
            </Group>
            <Group position="apart">
                <Text size={20} fw={500}>
                    Phí vận chuyển
                </Text>
                <Text size={20}>
                    {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                        maximumFractionDigits: 9,
                    }).format(0)}
                </Text>
            </Group>
            <Group position="apart">
                <Text size={20} fw={500}>
                    Giảm giá
                </Text>
                <Text size={20}>0vnđ</Text>
            </Group>
            <Group spacing={0}>
                <TextInput placeholder="Mã giảm giá" size="md"></TextInput>
                <Button>Áp dụng</Button>
            </Group>
            <Divider variant="dashed" mt={10}></Divider>
            <Group position="apart">
                <Text size={20} fw={500}>
                    Tổng tiền
                </Text>
                <Text size={20}>8.900.000vnđ</Text>
            </Group>
            <Group position="apart">
                <Link to="/cart">
                    <Group spacing={0}>
                        <IconChevronLeft />
                        <Text color="gray">Quay về giỏ hàng</Text>
                    </Group>
                </Link>
                <Button size="lg">Hoàn tất đặt hàng</Button>
            </Group>
        </Stack>
    );
}
