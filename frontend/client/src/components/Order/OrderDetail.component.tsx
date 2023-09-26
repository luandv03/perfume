import {
    Stack,
    Text,
    Select,
    SimpleGrid,
    Table,
    Button,
    Flex,
    Alert,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { notifications } from "@mantine/notifications";

import { orderService } from "../../services/order.service";
import { handleOrderDate } from "../../helpers/handleOrderDate.helper";
// import { paymentService } from "../../services/payment.service";
import { createWindow } from "../../helpers/createWindow.helper";

interface CouponType {
    coupon_id: number;
    coupon_code: string;
    coupon_discount: number;
}

interface OrderlineType {
    orderline_id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    net_price: number;
    title: string;
}

// interface TransactionType {
//     vnpay_wallet_id: number;
//     vnp_bankcode: string;
//     vnp_cardtype: string;
//     vnp_paydate: string;
//     vnp_transactionstatus: string;
// }

export const OrderDetail = () => {
    const [orderDetail, setOrderDetail] = useState({
        order: {
            order_id: 0,
            customer_id: 0,
            tax: 0,
            status: "",
            delivery_cost: 0,
            order_date: "",
            email: "",
            fullname: "",
            address: "",
            payment_status: "",
            payment_type: "",
        },
        orderlines: [
            {
                orderline_id: 0,
                order_id: 0,
                product_id: 0,
                quantity: 0,
                net_price: 0,
                title: "",
            },
        ],
        coupons: [
            {
                coupon_id: 3,
                coupon_code: "",
                coupon_discount: 0,
            },
        ],
    });
    // const [trans, setTrans] = useState<TransactionType[] | []>([]);

    const { order_id } = useParams();

    const handleGetOrderById = async () => {
        const res = await orderService.getOrderById(Number(order_id));

        setOrderDetail(res.data);
    };

    // const handleGetTrans = async () => {
    //     const res = await paymentService.getVnpayTrans(Number(order_id));

    //     console.log(res);

    //     setTrans(res.data);
    // };

    const handleSumAmount = (orderlines: OrderlineType[]) => {
        let sum = 0;
        for (const orderline of orderlines) {
            sum += orderline.net_price * orderline.quantity;
        }

        return sum;
    };

    const handleSumCoupon = (coupons: CouponType[]): number => {
        let sumCoupon = 0;
        for (const cp of coupons) {
            sumCoupon += cp.coupon_discount;
        }

        return sumCoupon;
    };

    const handleTotalMoney = () => {
        let total = 0;

        const sumAmount = handleSumAmount(orderDetail.orderlines);

        const sumCoupon = handleSumCoupon(orderDetail.coupons);

        total = sumAmount * (1 - sumCoupon / 100);

        total =
            total * (1 + orderDetail.order.tax / 100) +
            orderDetail.order.delivery_cost;

        return total;
    };

    const handleCancelOrderById = async () => {
        const res = await orderService.cancelOrder(Number(order_id));

        if (res.statusCode === 200) {
            setOrderDetail((prev) => ({
                ...prev,
                order: {
                    ...prev.order,
                    status: res.data.status,
                },
            }));
        }
        notifications.show({
            message: res.message,
        });
    };

    const handlePayment = async (
        methodPayment: string,
        amount: number,
        order_id: number
    ) => {
        createWindow(
            `https://perfume-lgj8.onrender.com/api/v1/payment/${methodPayment}/create_payment_url?amount=${amount}&order_id=${order_id}`,
            "_blank",
            800,
            600
        );
    };

    useEffect(() => {
        handleGetOrderById();
        // handleGetTrans();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const rows =
        orderDetail.orderlines.length > 0 &&
        orderDetail.orderlines.map((item) => (
            <tr key={item.orderline_id}>
                <td>
                    <Link
                        to={`/product/${item.product_id}`}
                        style={{ textDecoration: "none" }}
                    >
                        {item.product_id}
                    </Link>
                </td>
                <td>{item.title}</td>
                <td>{new Intl.NumberFormat("vi-VN").format(item.net_price)}</td>
                <td>{item.quantity}</td>
                <td>
                    {new Intl.NumberFormat("vi-VN").format(
                        item.net_price * item.quantity
                    )}
                </td>
            </tr>
        ));

    // const rowTrans =
    //     trans.length > 0 &&
    //     trans.map((item: TransactionType) => (
    //         <tr key={item.vnpay_wallet_id}>
    //             <td>{item.vnpay_wallet_id}</td>
    //             <td>{item.vnp_bankcode}</td>
    //             <td>{item.vnp_cardtype}</td>
    //             <td>{item.vnp_paydate}</td>
    //             <td>{item.vnp_transactionstatus}</td>
    //         </tr>
    //     ));

    return (
        <Stack w="100%" sx={{ overflowX: "scroll" }}>
            <Text fw={700} size="xl" fz="xl">
                Order
            </Text>
            <SimpleGrid
                w="100%"
                cols={3}
                spacing="xl"
                breakpoints={[{ maxWidth: "48rem", cols: 2 }]}
            >
                <Stack>
                    <Stack spacing={0}>
                        <Text fw={700} fz="xl">
                            Date
                        </Text>
                        <Stack>
                            {handleOrderDate(orderDetail.order.order_date)}
                        </Stack>
                    </Stack>
                    <Select
                        data={[
                            {
                                value: "done",
                                label: "Đã hoàn thành",
                            },
                            { value: "canceled", label: "Đã hủy" },
                            { value: "ordered", label: "Đang chờ xác nhận" },
                            {
                                value: "accepted",
                                label: "Đang xử lý",
                            },
                        ]}
                        value={orderDetail.order.status}
                    />
                </Stack>

                <Stack>
                    <Stack spacing={0}>
                        <Stack>
                            <Text fw={700} fz="xl">
                                Mã đơn
                            </Text>
                        </Stack>
                        <Stack>{orderDetail.order.order_id}</Stack>
                    </Stack>
                    <Button
                        disabled={orderDetail.order.status !== "ordered"}
                        onClick={() => handleCancelOrderById()}
                    >
                        Hủy
                    </Button>
                </Stack>

                {/* PC, tablet */}
                <Stack
                    sx={{
                        "@media (max-width: 64em)": {
                            display: "none",
                        },
                    }}
                >
                    <Stack spacing={0}>
                        <Text fw={700} fz="xl">
                            Khách hàng
                        </Text>
                        <Stack spacing={0}>
                            <Link
                                to="/customer/123"
                                style={{ textDecoration: "none" }}
                            >
                                <Text fw={500}>
                                    {orderDetail.order &&
                                        orderDetail.order.fullname}
                                </Text>
                                <Text fw={400}>
                                    {orderDetail.order &&
                                        orderDetail.order.email}
                                </Text>
                            </Link>
                        </Stack>
                    </Stack>
                    <Stack spacing={0}>
                        <Text fw={700} fz="xl">
                            Địa chỉ
                        </Text>
                        <Text>
                            {orderDetail.order && orderDetail.order.address}
                        </Text>
                    </Stack>
                </Stack>

                <Flex
                    gap={10}
                    sx={{
                        "@media (min-width: 64em)": {
                            display: "none",
                        },
                    }}
                >
                    <Stack spacing={0}>
                        <Text fw={700} fz="xl">
                            Khách hàng
                        </Text>
                        <Stack spacing={0}>
                            <Link
                                to="/customer/123"
                                style={{ textDecoration: "none" }}
                            >
                                <Text fw={500}>
                                    {orderDetail.order &&
                                        orderDetail.order.fullname}
                                </Text>
                                <Text fw={400}>
                                    {orderDetail.order &&
                                        orderDetail.order.email}
                                </Text>
                            </Link>
                        </Stack>
                    </Stack>
                    <Stack spacing={0}>
                        <Text fw={700} fz="xl">
                            Địa chỉ
                        </Text>
                        <Text>
                            {orderDetail.order && orderDetail.order.address}
                        </Text>
                    </Stack>
                </Flex>
            </SimpleGrid>
            <Text fw={700} size="xl" fz="xl">
                Items
            </Text>

            <Table>
                <thead>
                    <tr>
                        <th>Mã sản phẩm</th>
                        <th>Tên sản phẩm</th>
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Tổng tiền</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>

            <Text fw={700} size="xl" fz="xl">
                Totals
            </Text>
            <Table w="100%">
                <thead>
                    <tr>
                        <th>Tổng đơn hàng</th>
                        <th>
                            {orderDetail.orderlines.length > 0 &&
                                new Intl.NumberFormat("vi-VN").format(
                                    handleSumAmount(orderDetail.orderlines)
                                )}{" "}
                            VND
                        </th>
                    </tr>
                    <tr>
                        <th>Giảm giá</th>
                        <th>
                            {orderDetail.coupons.length > 0
                                ? orderDetail.coupons.map(
                                      (coupon: CouponType) => (
                                          <span key={coupon.coupon_id}>
                                              {coupon.coupon_discount}%
                                          </span>
                                      )
                                  )
                                : 0}
                        </th>
                    </tr>
                    <tr>
                        <th>Thuế(%)</th>
                        <th>{orderDetail.order.tax}</th>
                    </tr>
                    <tr>
                        <th>Vận chuyển</th>
                        <th>
                            {new Intl.NumberFormat("vi-VN").format(
                                orderDetail.order.delivery_cost
                            )}{" "}
                            VND
                        </th>
                    </tr>
                    <tr>
                        <th>Tổng tiền</th>
                        <th>
                            {" "}
                            {new Intl.NumberFormat("vi-VN").format(
                                handleTotalMoney()
                            )}{" "}
                            VND
                        </th>
                    </tr>
                </thead>
            </Table>
            <Text fw={700} size="xl" fz="xl">
                Giao dịch
            </Text>
            {orderDetail.order.payment_status === "1" ? (
                // <Table>
                //     <thead>
                //         <tr>
                //             <th>Mã giao dịch</th>
                //             <th>Ngân hàng</th>
                //             <th>Loại thẻ</th>
                //             <th>Ngày thanh toán</th>
                //             <th>Trạng thái</th>
                //         </tr>
                //     </thead>
                //     <tbody>{rowTrans}</tbody>
                // </Table>
                <div>
                    <Alert title="Chú ý!" color="red">
                        <Text fw={700}> Bạn đã thanh toán đơn hàng</Text>
                    </Alert>
                </div>
            ) : (
                <div>
                    <Alert title="Chú ý!" color="red">
                        <Text fw={700}> Bạn chưa thanh toán đơn hàng</Text>
                    </Alert>
                    {orderDetail.order.status !== "canceled" && (
                        <Button
                            mt={10}
                            onClick={() =>
                                handlePayment(
                                    "vnpay",
                                    handleTotalMoney(),
                                    Number(order_id)
                                )
                            }
                        >
                            Thanh toán lại đơn hàng
                        </Button>
                    )}
                </div>
            )}
            <Flex
                style={{
                    width: "100%",
                    height: "100%",
                }}
                justify="space-between"
                align="center"
            >
                <Button
                    color="red"
                    size="md"
                    radius="md"
                    sx={() => ({
                        cursor: "pointer",
                        "&hover": {
                            opacity: "0.9",
                        },
                    })}
                    disabled
                >
                    <IconTrash style={{ marginRight: "5px" }} />
                    Xóa
                </Button>
            </Flex>
        </Stack>
    );
};
