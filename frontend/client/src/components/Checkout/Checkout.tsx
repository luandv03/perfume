import {
    Stack,
    Text,
    Divider,
    Group,
    TextInput,
    Button,
    LoadingOverlay,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { IconChevronLeft } from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";
import { useContext, useState } from "react";
import { CartContext } from "../../providers/CartProvider/CartProvider";
import { AuthContext } from "../../providers/AuthProvider/AuthProvider";
import { orderService } from "../../services/order.service";

type OrderItem = {
    product_id: number;
    quantity: number;
    net_price: number;
};

type OrderCreate = {
    customer_id: number;
    delivery_cost: number;
    tax: number;
    orderList: OrderItem[];
};

type Product = {
    product_id: number;
    quantity: number;
    price: number;
    discount: number;
};

export function Checkout() {
    const [loading, setLoading] = useState(false);
    const { cartUser } = useContext(CartContext);
    const { profile } = useContext(AuthContext);

    const handleCheckout = async () => {
        setLoading(true);
        const orderList: OrderItem[] = cartUser.map((item: Product) => {
            return {
                product_id: item.product_id,
                quantity: item.quantity,
                net_price: item.price * (1 - item.discount / 100),
            };
        });

        const payload: OrderCreate = {
            customer_id: profile.customer_id,
            tax: 0,
            delivery_cost: 0,
            orderList,
        };

        try {
            const resData = await orderService.createOrder(payload);

            if (resData.statusCode == 200) {
                showNotification({
                    title: "Thanh cong",
                    message: resData.message,
                });
                return setLoading(false);
            }
            showNotification({
                title: "Khong thanh cong",
                message: resData.message,
            });
            setLoading(false);
        } catch (error: any) {
            showNotification({
                title: "that bai",
                message: error.message,
            });
            setLoading(false);
        }
    };

    return (
        <Stack w={700} spacing={6}>
            <Text size={24} fw={500}>
                Đơn hàng
            </Text>
            <Divider></Divider>
            {cartUser.length > 0 &&
                cartUser.map((item) => (
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
                        cartUser.reduce(
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
                <Button size="lg" onClick={() => handleCheckout()}>
                    Hoàn tất đặt hàng
                </Button>
            </Group>
            <LoadingOverlay
                sx={{ height: "120vh" }}
                loaderProps={{ size: "sm", color: "pink", variant: "bars" }}
                overlayOpacity={0.3}
                overlayColor="#c5c5c5"
                visible={loading}
            />
        </Stack>
    );
}
