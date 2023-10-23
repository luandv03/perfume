import {
    Stack,
    Text,
    Divider,
    Group,
    TextInput,
    Button,
    LoadingOverlay,
    Center,
    Paper,
    Container,
    Accordion,
    Radio,
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { IconChevronLeft, IconLoader } from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";
import { useContext, useState } from "react";

import { CartContext } from "../../providers/CartProvider/CartProvider";
import { AuthContext } from "../../providers/AuthProvider/AuthProvider";
import { orderService } from "../../services/order.service";
import { getItemLocalStorage } from "../../helpers/handleLocalStorage.helper";
import { createWindow } from "../../helpers/createWindow.helper";
import { CartItem } from "../Cart/Cart";
import { BASE_URL_API } from "../../configs/server.config";

type OrderItem = {
    product_id: number;
    quantity: number;
    net_price: number;
};

type OrderCreate = {
    customer_id: number;
    delivery_cost: number;
    tax: number;
    payment_type: string;
    coupon_id?: number;
    orderList: OrderItem[];
};

type Product = {
    product_id: number;
    quantity: number;
    price: number;
    discount: number;
};

// "coupon_id": 7,
// "coupon_name": "Vui trung thu cùng LDA",
// "coupon_code": "XdfRtk",
// "coupon_discount": "10",
// "condition": "Áp dụng cho mọi đơn hàng",
// "quantity": 15,
// "start_time": "2023-09-29T17:00:00.000Z",
// "end_time": "2023-12-29T17:00:00.000Z"
type CouponType = {
    coupon_id: number;
    coupon_name: string;
    coupon_discount: number;
};

export function Checkout() {
    const [loading, setLoading] = useState(false);
    const { cartUser } = useContext(CartContext);
    const { profile } = useContext(AuthContext);
    const [methodPayment, setMethodPayment] = useState("cod");
    const [coupon, setCoupon] = useState<CouponType | null>(null);
    const [couponError, setCouponError] = useState<string>("");
    const [couponCode, setCouponCode] = useState("");
    const [loadingCoupon, setLoadingCoupon] = useState(false);

    const navigate = useNavigate();

    const handlePayment = (
        methodPayment: string,
        amount: number,
        order_id: number
    ) => {
        const newWindow = createWindow(
            `${BASE_URL_API}/payment/${methodPayment}/create_payment_url?amount=${amount}&order_id=${order_id}`,
            "_blank",
            800,
            600
        );

        return newWindow;
    };

    const handleCheckout = async () => {
        if (!getItemLocalStorage("isAuthenticated"))
            return showNotification({
                message: "Hãy đăng nhập để mua hàng nhé",
            });

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
            payment_type: methodPayment,
            orderList,
            coupon_id: coupon?.coupon_id,
        };

        try {
            const resData = await orderService.createOrder(payload);

            if (resData.statusCode == 200) {
                if (methodPayment == "cod") {
                    showNotification({
                        title: "Đặt hàng thành công",
                        message: resData.message,
                    });
                    setLoading(false);

                    return navigate(
                        `/checkout/thankyou/${resData.data.order_id}`
                    );
                }

                /// vn pay
                const amount = Math.ceil(
                    coupon
                        ? (1 - coupon.coupon_discount * 0.01) *
                              cartUser.reduce(
                                  (acc: number, curr: CartItem) =>
                                      acc +
                                      curr.quantity *
                                          curr.price *
                                          (1 - curr.discount * 0.01),
                                  0
                              )
                        : cartUser.reduce(
                              (acc: number, curr: CartItem) =>
                                  acc +
                                  curr.quantity *
                                      curr.price *
                                      (1 - curr.discount * 0.01),
                              0
                          )
                );

                let timer: ReturnType<typeof setTimeout> | null = null;
                const windowPayment = handlePayment(
                    methodPayment,
                    amount,
                    resData.data.order_id
                );

                if (windowPayment) {
                    timer = setInterval(async () => {
                        if (windowPayment.closed) {
                            setLoading(false);
                            if (localStorage.getItem("code") == "00") {
                                showNotification({
                                    title: "Đặt hàng thành công",
                                    message: resData.message,
                                });

                                navigate(
                                    `/checkout/thankyou/${resData.data.order_id}`
                                );
                            }

                            if (timer) clearInterval(timer);

                            return;
                        }
                    }, 500);
                }
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            showNotification({
                title: "Đặt hàng thất bại",
                message: error.message,
            });
            setLoading(false);
        }
    };

    const handleGetCoupon = async () => {
        setCouponError("");

        if (!couponCode) return setCouponError("Mời bạn nhập mã giảm giá");

        setLoadingCoupon(true);
        const res = await orderService.getCouponByCode(couponCode);
        setLoadingCoupon(false);

        if (res.statusCode !== 200) {
            return setCouponError(res.message);
        }

        setCoupon(res.data);

        setCouponError(
            res.data.coupon_name +
                `: Giảm -${res.data.coupon_discount}% giá trị đơn hàng`
        );
    };

    return (
        <Center
            sx={{
                "@media (max-width: 64em)": {
                    flexDirection: "column",
                },
            }}
        >
            <Container
                w={400}
                sx={{
                    border: "1px solid #f0e7e7",
                    borderRadius: "4px",
                    "@media (max-width: 64em)": {
                        width: "100%",
                    },
                    "@media (min-width: 64em)": {
                        marginRight: "20px",
                    },
                }}
                p={10}
            >
                <Stack>
                    <Text size="lg" fw={700}>
                        Payment
                    </Text>
                    <Stack>
                        <Accordion>
                            <Radio.Group
                                value={methodPayment}
                                onChange={setMethodPayment}
                                withAsterisk
                            >
                                <Accordion.Item value="customization">
                                    <Accordion.Control>
                                        <Radio
                                            value="momo"
                                            label="Pay with MOMO"
                                        />
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        <Paper shadow="xs" p="md">
                                            <Text>
                                                Bước 1: Quý Khách Hàng vui lòng
                                                chọn hình thức Thanh toán qua
                                                MOMO-QR và Bấm Đặt hàng.
                                                <br />
                                                Bước 2: Quý Khách Hàng làm theo
                                                hướng dẫn để sử dụng mã QR thanh
                                                toán.
                                                <br />
                                                Bước 3: Nhân viên CSKH của
                                                Perfume LDA sẽ liên hệ Quý Khách
                                                Hàng để xác nhận thanh toán và
                                                xử lý đơn hàng.
                                            </Text>
                                        </Paper>
                                    </Accordion.Panel>
                                </Accordion.Item>

                                <Accordion.Item value="flexibility">
                                    <Accordion.Control>
                                        <Radio
                                            value="vnpay"
                                            label="Pay with VNPAY-QR"
                                        />
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        <Paper shadow="xs" p="md">
                                            <Text>
                                                Bước 1: Quý Khách Hàng vui lòng
                                                chọn hình thức Thanh toán qua
                                                VNPay-QR và Bấm Đặt hàng.
                                                <br />
                                                Bước 2: Quý Khách Hàng làm theo
                                                hướng dẫn để sử dụng mã QR thanh
                                                toán.
                                                <br />
                                                Bước 3: Nhân viên CSKH của
                                                Perfume LDA sẽ liên hệ Quý Khách
                                                Hàng để xác nhận thanh toán và
                                                xử lý đơn hàng.
                                            </Text>
                                        </Paper>
                                    </Accordion.Panel>
                                </Accordion.Item>

                                <Accordion.Item value="focus-ring">
                                    <Accordion.Control>
                                        <Radio
                                            value="cod"
                                            label="Payment upon delivery (COD)"
                                        />
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        <Paper shadow="xs" p="md">
                                            <Text>
                                                Bước 1: Quý Khách Hàng vui lòng
                                                chọn hình thức Thanh toán khi
                                                giao hàng (COD) và Bấm Đặt hàng.
                                                <br />
                                                Bước 2: Nhân viên CSKH của
                                                Perfume LDA sẽ liên hệ với Quý
                                                Khách Hàng để xác nhận và xử lý
                                                đơn hàng.
                                                <br />
                                                Bước 3: Quý Khách Hàng chỉ phải
                                                thanh toán khi nhận được hàng.
                                            </Text>
                                        </Paper>
                                    </Accordion.Panel>
                                </Accordion.Item>
                            </Radio.Group>
                        </Accordion>
                    </Stack>
                </Stack>
            </Container>

            <Stack
                w={700}
                spacing={6}
                sx={{
                    "@media (max-width: 64em)": {
                        width: "100%",
                    },
                }}
            >
                <Text size={24} fw={500}>
                    Order
                </Text>
                <Divider></Divider>
                {cartUser.length > 0 &&
                    cartUser.map((item) => (
                        <Group
                            spacing={30}
                            position="apart"
                            key={item.product_id}
                        >
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
                                    }).format(
                                        item.price * (item.discount / 100)
                                    )}
                                </Text>
                            </Stack>
                        </Group>
                    ))}
                <Divider my="lg" variant="dashed"></Divider>
                <Group position="apart">
                    <Text size={20} fw={500}>
                        Sum
                    </Text>
                    <Text size={20}>
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
                                            (1 - curr.discount * 0.01),
                                    0
                                )
                            )
                        )}
                    </Text>
                </Group>
                <Group position="apart">
                    <Text size={20} fw={500}>
                        Delivery
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
                        Discount
                    </Text>
                    <Text size={20}>
                        {coupon ? "-" + coupon?.coupon_discount + "%" : 0}
                    </Text>
                </Group>
                <Group spacing={4}>
                    <TextInput
                        placeholder="Enter coupon"
                        size="md"
                        value={couponCode}
                        onChange={(e) => {
                            if (couponError.length) {
                                setCouponError("");
                                setCoupon(null);
                            }
                            setCouponCode(e.target.value);
                        }}
                    ></TextInput>
                    <Button
                        h={42}
                        onClick={() => handleGetCoupon()}
                        disabled={loadingCoupon}
                    >
                        {loadingCoupon ? (
                            <IconLoader
                                className={loadingCoupon ? "spinner" : ""}
                            />
                        ) : (
                            "Apply"
                        )}
                    </Button>
                </Group>
                {!!couponError && <Text color="red">{couponError}</Text>}
                <Divider variant="dashed" mt={10}></Divider>
                <Group position="apart">
                    <Text size={20} fw={500}>
                        Total
                    </Text>
                    <Text size={20}>
                        {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                            maximumFractionDigits: 9,
                        }).format(
                            Math.ceil(
                                coupon
                                    ? (1 - coupon.coupon_discount * 0.01) *
                                          cartUser.reduce(
                                              (acc: number, curr: CartItem) =>
                                                  acc +
                                                  curr.quantity *
                                                      curr.price *
                                                      (1 -
                                                          curr.discount * 0.01),
                                              0
                                          )
                                    : cartUser.reduce(
                                          (acc: number, curr: CartItem) =>
                                              acc +
                                              curr.quantity *
                                                  curr.price *
                                                  (1 - curr.discount * 0.01),
                                          0
                                      )
                            )
                        )}
                    </Text>
                </Group>
                <Group position="apart">
                    <Link to="/cart">
                        <Group spacing={0}>
                            <IconChevronLeft />
                            <Text color="gray">Back cart</Text>
                        </Group>
                    </Link>
                    <Button size="lg" onClick={() => handleCheckout()}>
                        Complete your order
                    </Button>
                </Group>
                <LoadingOverlay
                    sx={{ position: "fixed", height: "100%" }}
                    loaderProps={{ size: "sm", color: "pink", variant: "oval" }}
                    overlayOpacity={0.3}
                    overlayColor="#c5c5c5"
                    visible={loading}
                />
            </Stack>
        </Center>
    );
}
