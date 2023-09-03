import { useEffect, useState } from "react";
import {
    createStyles,
    Table,
    Checkbox,
    rem,
    Stack,
    Group,
    Flex,
    NavLink,
    Box,
    Pagination,
    ActionIcon,
    Select,
} from "@mantine/core";
import { Link, useParams, useNavigate } from "react-router-dom";
// import { useDebouncedValue } from "@mantine/hooks";
import { IconDownload, IconEye } from "@tabler/icons-react";

import { SearchBar } from "../SearchBar/SearchBar.component";
import { orderService } from "../../services/order.service";
import { handleOrderDate } from "../../helpers/handleOrderDate.helpter";

const useStyles = createStyles((theme) => ({
    rowSelected: {
        backgroundColor:
            theme.colorScheme === "dark"
                ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
                : theme.colors[theme.primaryColor][0],
    },
}));

export function OrderList() {
    const [orders, setOrders] = useState([
        {
            order_id: 0,
            customer_id: 0,
            n_item: 0,
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
    const { classes, cx } = useStyles();
    const [selection, setSelection] = useState<number[]>([0]);
    const [value, setValue] = useState<string>("");
    const { status } = useParams();
    const navigate = useNavigate();
    // const [debounced] = useDebouncedValue(value, 200);

    const toggleRow = (id: number) =>
        setSelection((current) =>
            current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id]
        );
    const toggleAll = () =>
        setSelection((current) =>
            current.length === orders.length
                ? []
                : orders.map((item) => item.order_id)
        );

    const handleListOrders = async () => {
        const data = await orderService.getOrder(
            page,
            Number(total),
            status as string
        );

        setTotalPage(data.data.totalPage);
        setOrders(data.data.orders);
    };

    // const handleSearch = async (searchValue: string) => {
    //     const data = await productService.getProductByTitle(
    //         searchValue,
    //         page,
    //         Number(total)
    //     );

    //     setTotalPage(data.data.totalPage);
    //     setOrders(data.data.orders);
    // };

    useEffect(() => {
        !value && handleListOrders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, total, value, status]);

    // useEffect(() => {
    //     value && handleSearch(debounced);
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [debounced, page, total]);

    const rows =
        orders.length &&
        orders.map((item) => {
            const selected = selection.includes(item.order_id);
            return (
                <tr
                    key={item.order_id}
                    className={cx({ [classes.rowSelected]: selected })}
                >
                    <td>
                        <Checkbox
                            checked={selection.includes(item.order_id)}
                            onChange={() => toggleRow(item.order_id)}
                            transitionDuration={0}
                        />
                    </td>
                    <td>{item.order_id}</td>
                    <td>{item.customer_id}</td>
                    <td>{item.n_item}</td>
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
        <Stack>
            <Group>
                <Flex sx={{ width: "100%" }} justify="space-between">
                    <SearchBar value={value} setValue={setValue} />

                    <Group>
                        <Select
                            data={[
                                {
                                    value: "all",
                                    label: "Tất cả",
                                },
                                {
                                    value: "ordered",
                                    label: "Đang chờ xác nhận",
                                },
                                {
                                    value: "canceled",
                                    label: "Đã hủy",
                                },
                                {
                                    value: "accepted",
                                    label: "Đang xử lý",
                                },
                                {
                                    value: "done",
                                    label: "Đã hoàn thành",
                                },
                            ]}
                            value={status}
                            onChange={(value) => {
                                setPage(1);
                                navigate(`/order/${value}`);
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
                        <th style={{ width: rem(40) }}>
                            <Checkbox
                                onChange={toggleAll}
                                checked={selection.length === orders.length}
                                indeterminate={
                                    selection.length > 0 &&
                                    selection.length !== orders.length
                                }
                                transitionDuration={0}
                            />
                        </th>

                        <th>Mã đơn hàng</th>
                        <th>Mã khách hàng</th>
                        <th>Số sản phẩm</th>
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
                <Pagination value={page} onChange={setPage} total={totalPage} />
            </Flex>
        </Stack>
    );
}
