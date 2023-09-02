import { useEffect, useState } from "react";
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
    Select,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconPlus, IconDownload, IconEye } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { SearchBar } from "../SearchBar/SearchBar.component";
import { productService } from "../../services/product.service";

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
        product_id: number;
        category_name: string;
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
    const [products, setProducts] = useState([
        {
            product_id: 0,
            category_name: "",
            avatar: "",
            title: "",
            brand: "",
            year_publish: 0,
            volume: 0,
            price: 0,
            discount: 0,
            quantity: 0,
        },
    ]);
    const [totalPage, setTotalPage] = useState(0);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState<string>("10");
    const { classes, cx } = useStyles();
    const [selection, setSelection] = useState<number[]>([0]);
    const [value, setValue] = useState<string>("");
    const [debounced] = useDebouncedValue(value, 200);

    const toggleRow = (id: number) =>
        setSelection((current) =>
            current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id]
        );
    const toggleAll = () =>
        setSelection((current) =>
            current.length === products.length
                ? []
                : products.map((item) => item.product_id)
        );

    const handleListProducts = async () => {
        const data = await productService.listProducts(page, Number(total));

        setTotalPage(data.data.totalPage);
        setProducts(data.data.products);
    };

    const handleSearch = async (searchValue: string) => {
        const data = await productService.getProductByTitle(
            searchValue,
            page,
            Number(total)
        );

        setTotalPage(data.data.totalPage);
        setProducts(data.data.products);
    };

    useEffect(() => {
        !value && handleListProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, total, value]);

    useEffect(() => {
        value && handleSearch(debounced);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounced, page, total]);

    const rows =
        products.length &&
        products.map((item) => {
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
                    <td>{item.title}</td>
                    <td>{item.category_name}</td>
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
                    <SearchBar value={value} setValue={setValue} />

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
                        <th>Tên</th>
                        <th>Loại</th>
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
