import {
    Stack,
    Text,
    SimpleGrid,
    TextInput,
    Table,
    Flex,
    Pagination,
    ActionIcon,
    Select,
} from "@mantine/core";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { IconEye } from "@tabler/icons-react";

import { orderService } from "../../services/order.service";
import { customerService } from "../../services/customer.service";
import { handleOrderDate } from "../../helpers/handleOrderDate.helpter";
import { notifications } from "@mantine/notifications";

export const CustomerDetail = () => {
    const [customer, setCustomer] = useState({
        customer_id: 0,
        fullname: "",
        phone_number: "",
        address: "",
        dob: "",
        email: "",
        auth_method: "",
    });
    const [orders, setOrders] = useState([
        {
            order_id: 0,
            n_item: 0,
            status: "",
            tax: 0,
            delivery_cost: 0,
            tong_giam_gia: 0,
            order_date: "",
            tong_hoa_don: 0,
        },
    ]);
    const [totalPage, setTotalPage] = useState(0);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState<string>("10");
    const { customer_id } = useParams();

    const handleGetCustomerById = async () => {
        // check query params is number type
        if (!Number(customer_id)) {
            return notifications.show({
                message: "Customer Id must be a number.",
            });
        }

        const res = await customerService.getCustomerById(Number(customer_id));

        if (res.statusCode === 200) {
            setCustomer(res.data);
        }
    };

    const handleListOrders = async () => {
        const data = await orderService.getOrderByCustomerId(
            Number(customer_id),
            page,
            Number(total)
        );

        setTotalPage(data.data.totalPage);
        setOrders(data.data.orders);
    };

    const handleConvertStatusOrder = (status: string) => {
        if (status === "done") return "Hoàn thành";
        else if (status === "accepted") return "Đang xử lý";
        else if (status === "canceled") return "Đã hủy";
        else if (status === "ordered") return "Đang chờ xác nhận";
    };

    useEffect(() => {
        handleGetCustomerById();
        handleListOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        handleListOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, total]);

    const rows =
        orders.length &&
        orders.map((item) => {
            return (
                <tr key={item.order_id}>
                    <td>{item.order_id}</td>
                    <td>{item.n_item}</td>
                    <td>{handleConvertStatusOrder(item.status)}</td>
                    <td>{item.tax}</td>
                    <td>
                        {new Intl.NumberFormat("vi-VN").format(
                            item.delivery_cost
                        )}
                    </td>
                    <td>{item.tong_giam_gia}</td>
                    <td>
                        {new Intl.NumberFormat("vi-VN").format(
                            item.tong_hoa_don
                        )}
                    </td>
                    <td>{handleOrderDate(item.order_date)}</td>
                    <td>
                        <Link to={`/order/detail/${item.order_id}`}>
                            <ActionIcon>
                                <IconEye />
                            </ActionIcon>
                        </Link>
                    </td>
                </tr>
            );
        });

    return (
        <Stack sx={{ flex: 1 }}>
            <Text fw={700} size="xl" fz="xl">
                Thông tin cá nhân
            </Text>
            <Text>Mã khách hàng: {customer.customer_id}</Text>
            <SimpleGrid cols={3}>
                <TextInput label="Họ và tên" value={customer.fullname} />
                <TextInput
                    label="Số điện thoại"
                    value={customer.phone_number}
                />
                <TextInput label="Địa chỉ" value={customer.address} />
                <TextInput
                    label="Ngày sinh"
                    value={handleOrderDate(customer.dob)}
                />
                <TextInput label="Email" value={customer.email} />
                <TextInput
                    label="Loại tài khoản"
                    value={customer.auth_method}
                />
            </SimpleGrid>
            <Text fw={700} size="xl" fz="xl">
                Đơn hàng
            </Text>

            <Stack>
                <Table miw={800} verticalSpacing="sm" striped>
                    <thead>
                        <tr>
                            <th>Mã đơn hàng</th>
                            <th>Số sản phẩm</th>
                            <th>Trạng thái</th>
                            <th>Thuế(%)</th>
                            <th>Chi phí vận chuyển(vnd)</th>
                            <th>Giảm giá (%)</th>
                            <th>Tổng tiền (vnd)</th>
                            <th>Ngày đặt hàng</th>
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
                    />
                </Flex>
            </Stack>
            <Text fw={700} size="xl" fz="xl">
                Đánh giá sản phẩm
            </Text>
        </Stack>
    );
};
