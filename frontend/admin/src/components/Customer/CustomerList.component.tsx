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
];

export function CustomerList() {
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
                        <th>Mã khách hàng</th>
                        <th>Họ và tên</th>
                        <th>Email</th>
                        <th>Địa chỉ</th>
                        <th>Số điện thoại</th>
                        <th>Ngày sinh</th>
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
