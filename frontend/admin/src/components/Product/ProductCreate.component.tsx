import { useState, useEffect } from "react";
import {
    Tabs,
    Text,
    // Image,
    Flex,
    Box,
    Textarea,
    // createStyles,
    TextInput,
    Select,
    NumberInput,
    Stack,
    Button,
    FileInput,
} from "@mantine/core";
import {
    IconPhoto,
    IconMessageCircle,
    IconSettings,
    IconDeviceFloppy,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";

import { categoryService } from "../../services/category.service";
import { productService } from "../../services/product.service";

// const useStyles = createStyles({
//     shadowHover: {
//         "&:hover": {
//             boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
//             cursor: "pointer",
//         },
//     },
// });

interface ProductType {
    category_id: number;
    title: string;
    description: string;
    brand: string;
    year_publish: number;
    volume: number;
    price: number;
    discount: number;
    quantity: number;
}

export function ProductCreate() {
    // const { classes } = useStyles();
    const [files, setFiles] = useState<File[]>([]);

    const navigate = useNavigate();

    const [listCategorySelect, setListCategorySelect] = useState([
        {
            value: "0",
            label: "",
        },
    ]);

    const [product, setProduct] = useState<ProductType>({
        category_id: 0,
        title: "",
        description: "",
        brand: "",
        year_publish: 0,
        price: 0,
        quantity: 0,
        discount: 0,
        volume: 0,
    });

    const handleGetCategories = async () => {
        const data = await categoryService.getAllCategories();

        const cateList = data.data.map(
            (item: { category_id: string; category_name: string }) => {
                return {
                    value: String(item.category_id),
                    label: item.category_name,
                };
            }
        );

        setListCategorySelect(cateList);
    };

    const handleCreateProduct = async () => {
        console.log("create");
        const res = await productService.createProduct(product);

        notifications.show({
            title: "Update product",
            message: res.message + res.statusCode,
        });

        if (res.statusCode === 200) {
            navigate(`/product/${res.data.product_id}`);
        }
    };

    const handleCheckValidateInput = (): boolean => {
        let key: string;
        for (key of Object.keys(product)) {
            if (key !== "discount" && !product[key]) return false;
        }

        return true;
    };

    const handleUploadToCloud = async () => {
        if (!files.length) return;

        const formData = new FormData();
        formData.append("file", files);

        const res = await productService.uploadImage(formData);

        console.log(res);
    };

    useEffect(() => {
        handleGetCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Tabs defaultValue="gallery" sx={{ width: "100%" }}>
            <Tabs.List>
                <Tabs.Tab
                    fw={400}
                    value="gallery"
                    icon={<IconPhoto size="0.8rem" />}
                >
                    <Text size="lg">Ảnh</Text>
                </Tabs.Tab>
                <Tabs.Tab
                    fw={400}
                    value="messages"
                    icon={<IconMessageCircle size="0.8rem" />}
                >
                    <Text size="lg">Chi tiết</Text>
                </Tabs.Tab>
                <Tabs.Tab
                    fw={400}
                    value="settings"
                    icon={<IconSettings size="0.8rem" />}
                >
                    <Text size="lg">Mô tả</Text>
                </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="gallery" pt="xs">
                <Flex
                    style={{
                        width: "100%",
                    }}
                    wrap="wrap"
                    direction="row"
                    gap="xs"
                >
                    <Stack>
                        <Box maw={800}>
                            <FileInput
                                label="Upload files"
                                placeholder="Upload files"
                                multiple
                                value={files}
                                onChange={setFiles}
                            />
                        </Box>

                        <Button onClick={() => handleUploadToCloud()}>
                            Upload
                        </Button>
                    </Stack>
                </Flex>
            </Tabs.Panel>

            <Tabs.Panel value="messages" pt="xs">
                <Stack>
                    <Flex
                        style={{
                            width: "100%",
                        }}
                        wrap="wrap"
                        direction="row"
                        gap="xs"
                    >
                        <TextInput
                            placeholder="Your name"
                            label="Tên"
                            withAsterisk
                            miw={400}
                            value={product.title}
                            onChange={(e) => {
                                setProduct((prev) => ({
                                    ...prev,
                                    title: e.target.value,
                                }));
                            }}
                        />
                        <TextInput
                            placeholder="Your name"
                            label="Thương hiệu"
                            withAsterisk
                            miw={300}
                            value={product.brand}
                            onChange={(e) => {
                                setProduct((prev) => ({
                                    ...prev,
                                    brand: e.target.value,
                                }));
                            }}
                        />
                        <Select
                            label="Category"
                            placeholder="Pick one"
                            data={listCategorySelect}
                            value={String(product.category_id)}
                            onChange={(value) =>
                                setProduct((prev) => {
                                    return {
                                        ...prev,
                                        category_id: Number(value),
                                    };
                                })
                            }
                        />
                        <NumberInput
                            defaultValue={2018}
                            placeholder="Năm phát hành"
                            label="Năm phát hành"
                            withAsterisk
                            value={product.year_publish}
                            onChange={(value) => {
                                setProduct((prev) => ({
                                    ...prev,
                                    year_publish: value,
                                }));
                            }}
                        />

                        <NumberInput
                            defaultValue={100}
                            placeholder="Dung tích"
                            label="Dung tích(ml)"
                            withAsterisk
                            value={product.volume}
                            onChange={(value) => {
                                setProduct((prev) => ({
                                    ...prev,
                                    volume: value,
                                }));
                            }}
                        />

                        <NumberInput
                            defaultValue={18}
                            placeholder="Price(vnđ)"
                            label="Price"
                            withAsterisk
                            value={product.price}
                            onChange={(value) => {
                                setProduct((prev) => ({
                                    ...prev,
                                    price: value,
                                }));
                            }}
                        />
                        <NumberInput
                            defaultValue={18}
                            placeholder="Discount(%)"
                            label="Discount"
                            withAsterisk
                            value={product.discount}
                            onChange={(value) => {
                                setProduct((prev) => ({
                                    ...prev,
                                    discount: value,
                                }));
                            }}
                        />
                        <NumberInput
                            defaultValue={18}
                            placeholder="Quantity"
                            label="Quantity"
                            withAsterisk
                            value={product.quantity}
                            onChange={(value) => {
                                setProduct((prev) => ({
                                    ...prev,
                                    quantity: value,
                                }));
                            }}
                        />
                    </Flex>
                </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="settings" pt="xs">
                <Textarea
                    placeholder="Mô tả..."
                    label="Mô tả"
                    withAsterisk
                    autosize
                    minRows={4}
                    maxRows={8}
                    value={product.description}
                    onChange={(e) =>
                        setProduct((prev) => {
                            return {
                                ...prev,
                                description: e.target.value,
                            };
                        })
                    }
                />
            </Tabs.Panel>

            <Tabs.Panel value="feedbacks" pt="xs">
                Settings tab content
            </Tabs.Panel>

            <Flex style={{ width: "100%", marginTop: "20px" }}>
                <Box
                    sx={(theme) => ({
                        width: "100%",
                        height: "65px",
                        backgroundColor: theme.colors.gray[1],
                        borderRadius: theme.radius.md,
                        cursor: "pointer",
                    })}
                >
                    <Flex
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                        justify="space-between"
                        align="center"
                    >
                        <Button
                            size="md"
                            radius="md"
                            sx={() => ({
                                cursor: "pointer",
                                "&hover": {
                                    opacity: "0.9",
                                },
                            })}
                            onClick={() => handleCreateProduct()}
                            disabled={!handleCheckValidateInput()}
                        >
                            <IconDeviceFloppy style={{ marginRight: "5px" }} />
                            Save
                        </Button>
                    </Flex>
                </Box>
            </Flex>
        </Tabs>
    );
}
