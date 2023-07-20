import {
    Table,
    Stack,
    Group,
    NativeSelect,
    Flex,
    NavLink,
    Box,
    Pagination,
    ActionIcon,
} from "@mantine/core";
import { IconDownload, IconEye } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { SearchBar } from "../SearchBar/SearchBar.component";
import { orderService } from "../../services/order.service";
import { useEffect, useState } from "react";

interface CustomerType {
    customer_id: number;
    fullname: string;
    phone_number: string;
    address: string;
    email: string;
    dob: string;
}

export function OrderList() {
    const [orders, setOrders] = useState([]);
    const handleGetOrder = async () => {
        const res = await orderService.getOrder(0, 9);

        console.log(res);

        setOrders(res.data);
    };

    useEffect(() => {
        handleGetOrder();
    }, []);

    const rows =
        orders.length > 0 &&
        orders.map((item: any) => {
            return (
                <tr key={item.order_id}>
                    <td>{item.order_id}</td>
                    <td>{item.customer_id}</td>
                    <td>{item.tax}</td>
                    <td>{item.status}</td>
                    <td>{item.delivery_cost}</td>
                    <td>{item.order_date}</td>
                    <td>
                        <Link to={`/product/${item.customer_id}`}>
                            <ActionIcon>
                                <IconEye />
                            </ActionIcon>
                        </Link>
                    </td>
                </tr>
            );
        });

    return (
        <Stack>
            <Group>
                <Flex sx={{ width: "100%" }} justify="space-between">
                    <Group>
                        <SearchBar />
                        <NativeSelect
                            data={[
                                "Họ và tên",
                                "Email",
                                "Địa chỉ",
                                "Số điện thoại",
                                "Ngày sinh",
                            ]}
                            withAsterisk
                        />
                    </Group>

                    <Group>
                        <NativeSelect
                            data={[
                                "Tất cả",
                                "Đã mua hàng",
                                "Chưa mua hàng",
                                "Khách quen",
                            ]}
                            withAsterisk
                        />

                        <Box>
                            <NavLink
                                label="EXPORT"
                                icon={<IconDownload size="1.4rem" />}
                                sx={{
                                    color: "blue",
                                    fontWeight: "500",
                                }}
                            />
                        </Box>
                    </Group>
                </Flex>
            </Group>

            <Table miw={800} verticalSpacing="sm" striped>
                <thead>
                    <tr>
                        <th>Mã đơn hàng</th>
                        <th>Mã khách hàng</th>
                        <th>Thuế</th>
                        <th>Trạng thái</th>
                        <th>Chi phí vận chuyển</th>
                        <th>Ngày đặt hàng</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>

            <Flex sx={{ width: "100%" }} justify="flex-end">
                <Pagination total={10} />
            </Flex>
        </Stack>
    );
}
