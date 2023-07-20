import {
    Table,
    Stack,
    // Flex,
    // Pagination,
    Text,
    ActionIcon,
} from "@mantine/core";
import { IconEye } from "@tabler/icons-react";
import { useContext, useState, useEffect } from "react";

import { AuthContext } from "../../providers/AuthProvider/AuthProvider";
import { orderService } from "../../services/order.service";

interface OrderType {
    order_id: number;
    tax: number;
    delivery_cost: number;
    tong_giam_gia: number;
    order_date: string;
    tong_hoa_don: number;
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
        },
    ]);
    const { profile } = useContext(AuthContext);

    const handleGetOrderByCustomerId = async () => {
        const resOrder = await orderService.getOrderByCustomerId(
            profile.customer_id
        );
        console.log(resOrder);
        setOrders(resOrder.data);
    };

    useEffect(() => {
        handleGetOrderByCustomerId();
    }, []);

    const rows =
        orders.length > 0 &&
        orders.map((item: OrderType) => {
            return (
                <tr key={item.order_id}>
                    <td>{item.order_id}</td>
                    <td>{item.tax}</td>
                    <td>{item.tong_giam_gia}</td>
                    <td>{item.delivery_cost}</td>
                    <td>
                        {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                            maximumFractionDigits: 9,
                        }).format(item.tong_hoa_don)}
                    </td>
                    <td>{item.order_date}</td>
                    <td>
                        <ActionIcon>
                            <IconEye />
                        </ActionIcon>
                    </td>
                </tr>
            );
        });

    return (
        <Stack>
            <Text size={20}>ĐƠN HÀNG CỦA BẠN</Text>

            <Table miw={800} verticalSpacing="sm" striped>
                <thead>
                    <tr>
                        <th>Mã đơn hàng</th>
                        <th>Thuế(%)</th>
                        <th>Giảm giá(%)</th>
                        <th>Vận chuyển</th>
                        <th>Tổng giá trị đơn hàng</th>
                        <th>Ngày đặt hàng</th>
                        <th>Xem</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>

            {/* <Flex sx={{ width: "100%" }} justify="flex-end">
                <Pagination total={10} />
            </Flex> */}
        </Stack>
    );
}
