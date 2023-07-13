import {
    Table,
    Stack,
    // Flex,
    // Pagination,
    Text,
    ActionIcon,
} from "@mantine/core";
import { IconEye } from "@tabler/icons-react";

interface CustomerType {
    customer_id: number;
    fullname: string;
    phone_number: string;
    address: string;
    email: string;
    dob: string;
}

const data: CustomerType[] = [
    {
        customer_id: 1,
        fullname: "Dinh Van Luan",
        phone_number: "0867801606",
        address: "Ha Nam",
        email: "luan@gmail.com",
        dob: "28/08/2003",
    },
    {
        customer_id: 1,
        fullname: "Dinh Van Luan",
        phone_number: "0867801606",
        address: "Ha Nam",
        email: "luan@gmail.com",
        dob: "28/08/2003",
    },
    {
        customer_id: 1,
        fullname: "Dinh Van Luan",
        phone_number: "0867801606",
        address: "Ha Nam",
        email: "luan@gmail.com",
        dob: "28/08/2003",
    },
    {
        customer_id: 1,
        fullname: "Dinh Van Luan",
        phone_number: "0867801606",
        address: "Ha Nam",
        email: "luan@gmail.com",
        dob: "28/08/2003",
    },
    {
        customer_id: 1,
        fullname: "Dinh Van Luan",
        phone_number: "0867801606",
        address: "Ha Nam",
        email: "luan@gmail.com",
        dob: "28/08/2003",
    },
    {
        customer_id: 1,
        fullname: "Dinh Van Luan",
        phone_number: "0867801606",
        address: "Ha Nam",
        email: "luan@gmail.com",
        dob: "28/08/2003",
    },
];

export function OrderCustomer() {
    const rows = data.map((item: CustomerType) => {
        return (
            <tr key={item.customer_id}>
                <td>{item.customer_id}</td>
                <td>{item.fullname}</td>
                <td>{item.email}</td>
                <td>{item.address}</td>
                <td>{item.phone_number}</td>
                <td>{item.dob}</td>
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
