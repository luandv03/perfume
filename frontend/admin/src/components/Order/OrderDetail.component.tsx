import {
    Stack,
    Text,
    Select,
    SimpleGrid,
    Table,
    Button,
    Flex,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { notifications } from "@mantine/notifications";

import { orderService } from "../../services/order.service";
import { handleOrderDate } from "../../helpers/handleOrderDate.helpter";
import { mailerService } from "../../services/mailer.service";

// "orders": {
//     "order_id": 108,
//     "customer_id": 1,
//     "tax": 0,
//     "status": "accepted",
//     "delivery_cost": 0,
//     "order_date": "2023-08-16T17:00:00.000Z",
//     "email": "luanyhoa@gmail.com",
//     "address": "Ha Nam"
// },
// "orderlines": [
//     {
//         "orderline_id": 280,
//         "order_id": 108,
//         "product_id": 37,
//         "quantity": 1,
//         "net_price": "3600000",
//         "title": "Sole Di Positano"
//     },

// ],
// "coupons": [
//     {
//         "coupon_id": 3,
//         "coupon_code": "Y67ceB",
//         "coupon_discount": "12"
//     }
// ]

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

    const { order_id } = useParams();

    const handleGetOrderById = async () => {
        const res = await orderService.getOrderById(Number(order_id));

        setOrderDetail(res.data);
    };

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

    const handleAcceptOrderById = async (order_id: number) => {
        const res = await orderService.acceptOrderById(order_id);

        if (res.statusCode === 200) {
            setOrderDetail((prev) => ({
                ...prev,
                order: {
                    ...prev.order,
                    status: "accepted",
                },
            }));

            // send mail to customer
            const data = {
                orderlines: orderDetail.orderlines,
                order: {
                    order_id: orderDetail.order.order_id,
                    order_date: handleOrderDate(orderDetail.order.order_date),
                    tax: orderDetail.order.tax,
                    delivery_cost: orderDetail.order.delivery_cost,
                    tmp_amount: handleSumAmount(orderDetail.orderlines),
                    discount:
                        orderDetail.coupons.length > 0
                            ? orderDetail.coupons.reduce(
                                  (acc: number, curr: CouponType) =>
                                      acc + curr.coupon_discount,
                                  0
                              )
                            : 0,
                    amount: handleTotalMoney(),
                },
            };

            const to = orderDetail.order.email;

            const res = await mailerService.sendMail(to, data);

            notifications.show({
                title: res.statusCode,
                message: res.message,
            });
        }
    };

    useEffect(() => {
        handleGetOrderById();
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

    return (
        <Stack>
            <Text fw={700} size="xl" fz="xl">
                Order
            </Text>
            <SimpleGrid cols={3} spacing="xl">
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
                        onClick={() =>
                            handleAcceptOrderById(orderDetail.order.order_id)
                        }
                    >
                        Xác nhận
                    </Button>
                </Stack>
                <Stack>
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
            <Table>
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
                >
                    <IconTrash style={{ marginRight: "5px" }} />
                    Xóa
                </Button>
            </Flex>
        </Stack>
    );
};
