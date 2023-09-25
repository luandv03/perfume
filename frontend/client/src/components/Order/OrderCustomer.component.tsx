import {
    Table,
    Stack,
    Flex,
    Pagination,
    Text,
    ActionIcon,
    Select,
    Alert,
} from "@mantine/core";
import { IconEye } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { orderService } from "../../services/order.service";
import { handleOrderDate } from "../../helpers/handleOrderDate.helper";

interface OrderType {
    order_id: number;
    tax: number;
    delivery_cost: number;
    tong_giam_gia: number;
    order_date: string;
    tong_hoa_don: number;
    n_item: number;
    status: string;
    payment_type: string;
}

export function OrderCustomer() {
    const [orders, setOrders] = useState<OrderType[]>([
        {
            order_id: 0,
            tax: 0,
            delivery_cost: 0,
            tong_giam_gia: 0,
            order_date: "",
            tong_hoa_don: 0,
            n_item: 0,
            status: "",
            payment_type: "",
        },
    ]);
    const [totalPage, setTotalPage] = useState(0);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState<string>("10");

    const handleGetOrderByCustomerId = async () => {
        const resOrder = await orderService.getOrderByCustomerId(
            page,
            Number(total)
        );

        setTotalPage(resOrder.data.totalPage);
        setOrders(resOrder.data.orders);
    };

    useEffect(() => {
        handleGetOrderByCustomerId();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, total]);

    useEffect(() => {
        setPage(1);
    }, [total]);

    // "order_id": 1,
    // "n_item": 3,
    // "status": "done",
    // "tax": 0,
    // "delivery_cost": 30000,
    // "tong_giam_gia": "10",
    // "order_date": "2023-05-31T17:00:00.000Z",
    // "tong_hoa_don": 25482000

    const rows =
        orders.length > 0 &&
        orders.map((item: OrderType) => {
            return (
                <tr key={item.order_id}>
                    <td>{item.order_id}</td>
                    <td>{item.n_item}</td>
                    <td>{item.status}</td>
                    <td>{item.tax}</td>
                    <td>{item.tong_giam_gia}</td>
                    <td>
                        {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                            maximumFractionDigits: 9,
                        }).format(item.delivery_cost)}
                    </td>
                    <td>
                        {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                            maximumFractionDigits: 9,
                        }).format(item.tong_hoa_don)}
                    </td>
                    <td>{handleOrderDate(item.order_date)}</td>
                    <td>{item.payment_type}</td>
                    <td>
                        <Link
                            to={`/customer/order/detail/${item.order_id}`}
                            style={{ textDecoration: "none" }}
                        >
                            <ActionIcon>
                                <IconEye />
                            </ActionIcon>
                        </Link>
                    </td>
                </tr>
            );
        });

    return (
        <Stack sx={{ width: "100%", overflowX: "scroll" }}>
            <Text size={20}>ĐƠN HÀNG CỦA BẠN</Text>

            {orders.length <= 0 ? (
                <Alert title="Bummer!" color="red">
                    <Text fw={700}> Bạn chưa có đơn hàng nào</Text>
                </Alert>
            ) : (
                <>
                    <Table miw={800} verticalSpacing="sm" striped>
                        <thead>
                            <tr>
                                <th>Mã đơn hàng</th>
                                <th>Số sản phẩm</th>
                                <th>Trạng thái</th>
                                <th>Thuế(%)</th>
                                <th>Giảm giá(%)</th>
                                <th>Vận chuyển</th>
                                <th>Tổng giá trị đơn hàng</th>
                                <th>Ngày đặt hàng</th>
                                <th>Thanh toán</th>
                                <th>Xem</th>
                            </tr>
                        </thead>
                        <tbody>{rows}</tbody>
                    </Table>

                    <Flex sx={{ width: "100%" }} justify="flex-end" gap="xs">
                        <Select
                            placeholder="Pick one"
                            data={[
                                { value: "10", label: "10 products" },
                                { value: "20", label: "20 products" },
                                { value: "50", label: "50 products" },
                                { value: "100", label: "100 products" },
                            ]}
                            value={total}
                            onChange={setTotal}
                        />
                        <Pagination
                            value={page}
                            onChange={setPage}
                            total={totalPage}
                            w="100%"
                        />
                    </Flex>
                </>
            )}
        </Stack>
    );
}
