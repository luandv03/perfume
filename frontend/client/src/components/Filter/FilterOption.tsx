import {
    Stack,
    Text,
    Divider,
    // TextInput,
    // Button,
    ScrollArea,
    Checkbox,
    Flex,
    Group,
    Collapse,
} from "@mantine/core";
import {
    // IconSearch,
    IconX,
} from "@tabler/icons-react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

import { useState, useEffect, Dispatch, SetStateAction } from "react";

import { productService } from "../../services/product.service";

export function FilterOption({
    prices,
    setPrices,
    filterBrand,
    setFilterBrand,
}: {
    prices: string[];
    setPrices: Dispatch<SetStateAction<string[]>>;
    filterBrand: string[];
    setFilterBrand: Dispatch<SetStateAction<string[]>>;
}) {
    const [opened, { toggle }] = useDisclosure(false);
    const largeScreen = useMediaQuery("(min-width: 64em)");
    const [brands, setBrands] = useState<{ brand: string }[]>([]);

    useEffect(() => {
        localStorage.setItem("brand", JSON.stringify(filterBrand));
    }, [filterBrand]);

    useEffect(() => {
        localStorage.setItem("price", JSON.stringify(prices));
    }, [prices]);

    const handleGetAllBrand = async () => {
        const res = await productService.getAllBrand();

        setBrands(res.data);
    };

    const handleRemoveBrandChecked = (brand: string) => {
        setFilterBrand((prev: string[]) =>
            prev.filter((item: string) => item !== brand)
        );
    };

    const handleRemovePriceChecked = (price: string) => {
        setPrices((prev: string[]) =>
            prev.filter((item: string) => item !== price)
        );
    };

    const handleConvertFilterPrice = (price: string) => {
        // eslint-disable-next-line @typescript-eslint/no-inferrable-types
        let result: string = "";
        switch (price) {
            case "0,500000":
                result = "Giá dưới 500.0000";
                break;
            case "500000,1000000":
                result = "500.000đ - 1.000.000đ";
                break;
            case "1000000,5000000":
                result = "1.000.000đ - 5.000.000đ";
                break;
            case "5000000,0":
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                result = "Giá trên 5.000.000đ";
                break;
        }

        return result;
    };

    const handleRemoveAllFilter = () => {
        setPrices([]);
        setFilterBrand([]);
    };

    useEffect(() => {
        handleGetAllBrand();
    }, []);

    return (
        <Stack
            sx={{
                border: "1px solid #f0e7e7",
                borderRadius: "4px",
                width: "100%",
            }}
            spacing={0}
        >
            <div style={{ padding: "10px" }} onClick={toggle}>
                <Text size="16px" fw={500}>
                    Bộ lọc
                </Text>

                <Text>Giúp lọc nhanh sản phẩm tìm kiếm</Text>
            </div>
            <Collapse in={largeScreen || opened}>
                {filterBrand.length + prices.length > 0 ? (
                    <>
                        <Divider my="xs"></Divider>
                        <Stack p="10px">
                            <Flex justify="space-between">
                                <Text size="16px" fw={500}>
                                    Bạn chọn
                                </Text>

                                <Text
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleRemoveAllFilter()}
                                >
                                    Bỏ hết
                                </Text>
                            </Flex>

                            <Stack>
                                {filterBrand.length > 0 &&
                                    filterBrand.map(
                                        (item: string, index: number) => (
                                            <Group spacing={0} key={index}>
                                                <IconX
                                                    color="red"
                                                    size={20}
                                                    style={{
                                                        cursor: "pointer",
                                                    }}
                                                    onClick={() =>
                                                        handleRemoveBrandChecked(
                                                            item
                                                        )
                                                    }
                                                />
                                                <Text>{item}</Text>
                                            </Group>
                                        )
                                    )}
                                {prices.length > 0 &&
                                    prices.map(
                                        (item: string, index: number) => {
                                            return (
                                                <Group spacing={0} key={index}>
                                                    <IconX
                                                        color="red"
                                                        size={20}
                                                        style={{
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={() =>
                                                            handleRemovePriceChecked(
                                                                item
                                                            )
                                                        }
                                                    />
                                                    <Text>
                                                        {handleConvertFilterPrice(
                                                            item
                                                        )}
                                                    </Text>
                                                </Group>
                                            );
                                        }
                                    )}
                            </Stack>
                        </Stack>
                    </>
                ) : (
                    ""
                )}

                <Divider my="xs"></Divider>
                <Stack p="10px">
                    <Text size="16px" fw={500}>
                        Thương hiệu
                    </Text>
                    {/* <TextInput
                    placeholder="Tìm thương hiệu"
                    rightSection={
                        <Button size="sm" radius={0}>
                            <IconSearch size="18px" />
                        </Button>
                    }
                />  */}
                    <ScrollArea h={150} scrollbarSize="5px">
                        <Checkbox.Group
                            value={filterBrand}
                            onChange={setFilterBrand}
                        >
                            <Stack>
                                {brands.length > 0 &&
                                    brands.map((item: { brand: string }) => (
                                        <Checkbox
                                            value={item.brand}
                                            label={item.brand}
                                        />
                                    ))}
                            </Stack>
                        </Checkbox.Group>
                    </ScrollArea>
                </Stack>

                <Divider my="xs"></Divider>
                <Stack p="10px">
                    <Text size="16px" fw={500}>
                        Giá sản phẩm
                    </Text>
                    <ScrollArea h={150} scrollbarSize="5px">
                        <Checkbox.Group value={prices} onChange={setPrices}>
                            <Stack>
                                <Checkbox
                                    value={`${[0, 500000]}`}
                                    label="Giá dưới 500.0000"
                                />
                                <Checkbox
                                    value={`${[500000, 1000000]}`}
                                    label="500.000đ - 1.000.000đ"
                                />
                                <Checkbox
                                    value={`${[1000000, 5000000]}`}
                                    label="1.000.000đ - 5.000.000đ"
                                />
                                <Checkbox
                                    value={`${[5000000, 0]}`}
                                    label="Giá trên 5.000.000đ"
                                />
                            </Stack>
                        </Checkbox.Group>
                    </ScrollArea>
                </Stack>
            </Collapse>
        </Stack>
    );
}
