import { useState } from "react";
import {
    Tabs,
    Text,
    Image,
    Flex,
    Box,
    Textarea,
    createStyles,
    TextInput,
    Select,
    NumberInput,
    Stack,
    Button,
} from "@mantine/core";
import {
    IconPhoto,
    IconMessageCircle,
    IconSettings,
    IconDeviceFloppy,
    IconTrash,
} from "@tabler/icons-react";

export function PostDetail() {
    const { classes } = useStyles();

    // const [product, setProduct] = useState({
    //     product_id: 0,
    //     product_name: "",
    //     product_description: "",
    //     brand: "",
    //     year_publish: 0,
    //     price: 0,
    //     quantity: 0,
    //     discount: 0,
    // });

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
                <Tabs.Tab
                    fw={400}
                    value="feedbacks"
                    icon={<IconMessageCircle size="0.8rem" />}
                >
                    <Text size="lg">Đánh giá (3)</Text>
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
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(
                        (item: number) => (
                            <Box className={classes.shadowHover}>
                                <Image
                                    key={item}
                                    width={150}
                                    mx="auto"
                                    radius="md"
                                    src="https://cdn.shopify.com/s/files/1/0268/8267/0792/products/1_e73ea800-9922-49cb-ba2f-555060ec1e99.jpg?v=1674566715"
                                    alt="Random image"
                                />
                            </Box>
                        )
                    )}
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
                        />
                        <TextInput
                            placeholder="Your name"
                            label="Thương hiệu"
                            withAsterisk
                            miw={300}
                        />
                        <Select
                            label="Category"
                            placeholder="Pick one"
                            data={[
                                { value: "react", label: "Nước hoa Nam" },
                                { value: "ng", label: "Nước hoa nữ" },
                                { value: "svelte", label: "Nước hoa Unisex" },
                                { value: "vue", label: "Vue" },
                            ]}
                        />
                        <NumberInput
                            defaultValue={2018}
                            placeholder="Năm phát hành"
                            label="Năm phát hành"
                            withAsterisk
                        />

                        <NumberInput
                            defaultValue={100}
                            placeholder="Dung tích"
                            label="Dung tích(ml)"
                            withAsterisk
                        />

                        <NumberInput
                            defaultValue={18}
                            placeholder="Price(vnđ)"
                            label="Price"
                            withAsterisk
                        />
                        <NumberInput
                            defaultValue={18}
                            placeholder="Discount(%)"
                            label="Discount"
                            withAsterisk
                        />
                        <NumberInput
                            defaultValue={18}
                            placeholder="Quantity"
                            label="Quantity"
                            withAsterisk
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
                />
            </Tabs.Panel>

            <Tabs.Panel value="feedbacks" pt="xs">
                Settings tab content
            </Tabs.Panel>

            <Flex style={{ width: "100%", marginTop: "20px" }}>
                <Box
                    sx={(theme) => ({
                        width: "100%",
                        backgroundColor: theme.colors.gray[1],
                        padding: theme.spacing.xl,
                        borderRadius: theme.radius.md,
                        cursor: "pointer",
                    })}
                >
                    <Flex style={{ width: "100%" }} justify="space-between">
                        <Button
                            size="md"
                            radius="md"
                            sx={() => ({
                                cursor: "pointer",
                                "&hover": {
                                    opacity: "0.9",
                                },
                            })}
                            disabled
                        >
                            <IconDeviceFloppy style={{ marginRight: "5px" }} />
                            Save
                        </Button>
                        <Button
                            size="md"
                            radius="md"
                            variant="subtle"
                            color="gray"
                            sx={(them) => ({
                                color: "red",
                                "&hover": {
                                    backgroundColor: them.colors.black,
                                },
                            })}
                        >
                            <IconTrash
                                style={{
                                    marginRight: "5px",
                                }}
                            />
                            Delete
                        </Button>
                    </Flex>
                </Box>
            </Flex>
        </Tabs>
    );
}
