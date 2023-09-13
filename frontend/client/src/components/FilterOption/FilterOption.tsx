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

export function FilterOption() {
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
                        <Checkbox label="Dior" />
                        <Checkbox label="Gucci" />
                        <Checkbox label="Channel" />
                        <Checkbox label="Versace" />
                        <Checkbox label="Luis vutton" />
                        <Checkbox label="D&G" />
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
                        <Checkbox label="Giá dưới 100.0000" />
                        <Checkbox label="200.000đ - 300.000đ" />
                        <Checkbox label="I agree to sell my privacy" />
                        <Checkbox label="I agree to sell my privacy" />
                        <Checkbox label="I agree to sell my privacy" />
                        <Checkbox label="I agree to sell my privacy" />
                    </Stack>
                </ScrollArea>
            </Stack>
        </Stack>
    );
}
