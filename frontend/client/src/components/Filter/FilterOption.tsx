import {
    Stack,
    Text,
    Divider,
    TextInput,
    Button,
    ScrollArea,
    Checkbox,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useState, useEffect } from "react";

import { productService } from "../../services/product.service";

export function FilterOption() {
    const [brands, setBrands] = useState<{ brand: string }[]>([]);

    const handleGetAllBrand = async () => {
        const res = await productService.getAllBrand();

        setBrands(res.data);
    };

    useEffect(() => {
        handleGetAllBrand();
    }, []);

    return (
        <Stack
            sx={{ border: "1px solid #f0e7e7", borderRadius: "4px" }}
            spacing={0}
        >
            <div style={{ padding: "10px" }}>
                <Text size="16px" fw={500}>
                    Bộ lọc
                </Text>
                <Text>Giúp lọc nhanh sản phẩm tìm kiếm</Text>
            </div>
            <Divider my="xs"></Divider>
            <Stack p="10px">
                <Text size="16px" fw={500}>
                    Thương hiệu
                </Text>
                <TextInput
                    placeholder="Tìm thương hiệu"
                    rightSection={
                        <Button size="sm" radius={0}>
                            <IconSearch size="18px" />
                        </Button>
                    }
                />
                <ScrollArea h={150} scrollbarSize="5px">
                    <Stack>
                        {brands.length > 0 &&
                            brands.map((item: { brand: string }) => (
                                <Checkbox label={item.brand} />
                            ))}
                    </Stack>
                </ScrollArea>
            </Stack>

            <Divider my="xs"></Divider>
            <Stack p="10px">
                <Text size="16px" fw={500}>
                    Giá sản phẩm
                </Text>
                <ScrollArea h={150} scrollbarSize="5px">
                    <Stack>
                        <Checkbox label="Giá dưới 500.0000" />
                        <Checkbox label="500.000đ - 1.000.000đ" />
                        <Checkbox label="1.000.000đ - 5.000.000đ" />
                        <Checkbox label="Giá trên 10.000.000đ" />
                    </Stack>
                </ScrollArea>
            </Stack>
        </Stack>
    );
}
