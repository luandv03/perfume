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
    Select,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { IconDownload, IconEye } from "@tabler/icons-react";
import { Link, useParams, useNavigate } from "react-router-dom";

import { SearchBar } from "../SearchBar/SearchBar.component";
import { customerService } from "../../services/customer.service";
import { handleOrderDate } from "../../helpers/handleOrderDate.helpter";

interface CustomerType {
    customer_id: number;
    fullname: string;
    address: string;
    email: string;
    dob: string;
    n_orders: number;
    total_spent: number;
}

export function CustomerList() {
    const [customers, setCustomers] = useState([
        {
            customer_id: 0,
            n_orders: 0,
            total_spent: 0,
            fullname: "",
            address: "",
            email: "",
            dob: "",
        },
    ]);
    const [totalPage, setTotalPage] = useState(0);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState<string>("10");
    const [value, setValue] = useState<string>("");
    const navigate = useNavigate();
    const { type } = useParams();
    // const [debounced] = useDebouncedValue(value, 200);

    const handleListCustomers = async () => {
        const data = await customerService.getCustomers(
            type as string,
            page,
            Number(total)
        );

        setTotalPage(data.data.totalPage);
        setCustomers(data.data.customers);
    };

    useEffect(() => {
        !value && handleListCustomers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, total, value, type]);

    const rows =
        customers.length > 0 &&
        customers.map((item: CustomerType) => {
            return (
                <tr key={item.customer_id}>
                    <td>{item.customer_id}</td>
                    <td>{item.fullname}</td>
                    <td>{item.email}</td>
                    <td>{item.address}</td>
                    <td>{handleOrderDate(item.dob)}</td>
                    <td>{item.n_orders}</td>
                    <td>
                        {new Intl.NumberFormat("vi-VN").format(
                            item.total_spent
                        )}
                    </td>
                    <td>
                        <Link to={`/customer/detail/${item.customer_id}`}>
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
                        <SearchBar value={value} setValue={setValue} />

                        <NativeSelect
                            data={[
                                "Họ và tên",
                                "Email",
                                "Địa chỉ",
                                "Số điện thoại",
                            ]}
                            withAsterisk
                        />
                    </Group>

                    <Group>
                        <Select
                            data={[
                                {
                                    value: "all",
                                    label: "Tất cả",
                                },
                                { value: "yes", label: "Đã mua hàng" },
                                { value: "no", label: "Chưa mua hàng" },
                            ]}
                            value={type}
                            onChange={(value) => {
                                setPage(1);
                                navigate(`/customer/${value}`);
                            }}
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
                        <th>Ngày sinh</th>
                        <th>Số đơn hàng</th>
                        <th>Tổng chi</th>
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
                <Pagination value={page} onChange={setPage} total={totalPage} />
            </Flex>
        </Stack>
    );
}
