import { Flex, TextInput, Select, NumberInput, Stack } from "@mantine/core";

export function ProductDetail() {
    return (
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
    );
}
