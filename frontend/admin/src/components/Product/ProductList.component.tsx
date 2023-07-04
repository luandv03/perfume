import { useState } from "react";
import {
    createStyles,
    Table,
    Checkbox,
    Avatar,
    rem,
    Stack,
    Group,
    NativeSelect,
    Flex,
    NavLink,
    Box,
    Pagination,
    ActionIcon,
} from "@mantine/core";
import { IconPlus, IconDownload, IconEye } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { SearchBar } from "../SearchBar/SearchBar.component";

const useStyles = createStyles((theme) => ({
    rowSelected: {
        backgroundColor:
            theme.colorScheme === "dark"
                ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
                : theme.colors[theme.primaryColor][0],
    },
}));

interface ProductType {
    data: {
        product_id: string;
        avatar: string;
        title: string;
        brand: string;
        year_publish: number;
        volume: number;
        price: number;
        discount: number;
        quantity: number;
    }[];
}

export function ProductList({ data }: ProductType) {
    const { classes, cx } = useStyles();
    const [selection, setSelection] = useState(["1"]);
    const toggleRow = (id: string) =>
        setSelection((current) =>
            current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id]
        );
    const toggleAll = () =>
        setSelection((current) =>
            current.length === data.length
                ? []
                : data.map((item) => item.product_id)
        );

    const rows = data.map((item) => {
        const selected = selection.includes(item.product_id);
        return (
            <tr
                key={item.product_id}
                className={cx({ [classes.rowSelected]: selected })}
            >
                <td>
                    <Checkbox
                        checked={selection.includes(item.product_id)}
                        onChange={() => toggleRow(item.product_id)}
                        transitionDuration={0}
                    />
                </td>
                <td>
                    <Avatar size={26} src={item.avatar} radius={26} />
                </td>
                <td>{item.title}</td>
                <td>{item.brand}</td>
                <td>{item.year_publish}</td>
                <td>{item.volume}</td>
                <td>{new Intl.NumberFormat("vi-VN").format(item.price)}</td>
                <td>{item.discount}</td>
                <td>{item.quantity}</td>
                <td>
                    <Link to={`/product/${item.product_id}`}>
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
                    <SearchBar />

                    <Group>
                        <NativeSelect
                            data={["Tất cả", "Sales", "Bán chạy", "Còn hàng"]}
                            withAsterisk
                        />

                        <Box>
                            <NavLink
                                label="CREATE"
                                icon={<IconPlus size="1.4rem" />}
                                sx={{
                                    color: "blue",
                                    fontWeight: "500",
                                }}
                                component="a"
                                href="/product/create"
                            />
                        </Box>
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
                                checked={selection.length === data.length}
                                indeterminate={
                                    selection.length > 0 &&
                                    selection.length !== data.length
                                }
                                transitionDuration={0}
                            />
                        </th>
                        <th>Avatar</th>
                        <th>Tên</th>
                        <th>Thương hiệu</th>
                        <th>Năm sản xuất</th>
                        <th>Dung tích(ml)</th>
                        <th>Giá(vnđ)</th>
                        <th>Sales(%)</th>
                        <th>Số lượng</th>
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
